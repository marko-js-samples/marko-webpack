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
  }
}

const serverConfig = {
  name: "Server",
  entry: "./src/index.js",
  target: "async-node",
  externals: [/^(?!marko)[^./!]/],
  output: {
    libraryTarget: "commonjs2",
    publicPath: "/static/",
    path: path.join(__dirname, "dist/server"),
    filename: "main.js"
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.browser": undefined,
      "process.env.BUNDLE": true,
      "process.env.NODE_ENV": JSON.stringify(NODE_ENV)
    }),
    new IgnoreEmitPlugin(/\.(css|jpg|jpeg|gif|png)$/),
    spawnedServer,
    markoPlugin.server
  ],
  ...baseConfig
};

const browserConfig = {
  name: "Browser",
  target: "web",
  entry: markoPlugin.emptyEntry,
  output: {
    publicPath: "/static/",
    path: path.join(__dirname, "dist/client"),
    filename: "[name].[hash:10].js"
  },
  plugins: [
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
  },
  ...baseConfig
};

if (mode === "production") {
  const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
  browserConfig.plugins.push(new OptimizeCssAssetsPlugin());
}

module.exports = [browserConfig, serverConfig];
