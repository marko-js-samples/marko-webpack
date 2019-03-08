const path = require("path");
const webpack = require("webpack");
const MarkoPlugin = require("@marko/webpack/plugin").default;
const CSSExtractPlugin = require("mini-css-extract-plugin");
const IgnoreEmitPlugin = require("ignore-emit-webpack-plugin");
const SpawnServerPlugin = require("spawn-server-webpack-plugin");

const { NODE_ENV } = process.env;
const mode = NODE_ENV ? "production" : "development";
const spawnedServer = new SpawnServerPlugin();
const markoPlugin = new MarkoPlugin();

const baseConfig = {
  mode,
  output: {
    publicPath: "/static/"
  },
  resolve: {
    extensions: [".js", ".json", ".marko"]
  },
  module: {
    rules: [
      {
        test: /\.marko$/,
        loader: "@marko/webpack/loader"
      },
      {
        test: /\.(less|css)$/,
        use: [CSSExtractPlugin.loader, "css-loader", "less-loader"]
      },
      {
        test: /\.svg/,
        loader: "svg-url-loader"
      },
      {
        test: /\.(jpg|jpeg|gif|png)$/,
        loader: "file-loader"
      }
    ]
  },
  plugins: []
}

const serverConfig = {
  ...baseConfig,
  name: "Server",
  entry: "./src/index.js",
  target: "async-node",
  externals: [/^(?!marko)[^./!]/],
  output: {
    ...baseConfig.output,
    filename: "main.js",
    libraryTarget: "commonjs2",
    path: path.join(__dirname, "dist/server")
  },
  plugins: [
    ...baseConfig.plugins,
    new webpack.DefinePlugin({
      "process.browser": undefined,
      "process.env.BUNDLE": true,
      "process.env.NODE_ENV": JSON.stringify(NODE_ENV)
    }),
    new IgnoreEmitPlugin(/\.(css|jpg|jpeg|gif|png)$/),
    spawnedServer,
    markoPlugin.server
  ]
};

const browserConfig = {
  ...baseConfig,
  name: "Browser",
  target: "web",
  entry: markoPlugin.emptyEntry,
  output: {
    ...baseConfig.output,
    filename: "[name].[hash:10].js",
    path: path.join(__dirname, "dist/client"),
  },
  plugins: [
    ...baseConfig.plugins,
    new webpack.DefinePlugin({
      "process.browser": true,
      "process.env.NODE_ENV": JSON.stringify(NODE_ENV)
    }),
    new CSSExtractPlugin({
      filename: "[name].[hash:10].css"
    }),
    markoPlugin.browser
  ],
  devServer: {
    inline: false,
    proxy: {
      "**": {
        target: true,
        router: () => `http://localhost:${spawnedServer.address.port}`
      }
    },
    before(app) {
      process.env.PORT = 0;
      app.use((req, res, next) => {
        if (spawnedServer.listening) next();
        else spawnedServer.once("listening", next);
      });
    }
  }
};

if (mode === "production") {
  const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
  browserConfig.plugins.push(new OptimizeCssAssetsPlugin());
}

module.exports = [browserConfig, serverConfig];
