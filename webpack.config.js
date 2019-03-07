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
const resolveConfig = {
  extensions: [".js", ".json", ".marko"]
};
const moduleConfig = {
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
};

console.log({ mode })

module.exports = [
  {
    mode,
    name: "Server",
    entry: "./server.js",
    target: "async-node",
    externals: [/^(?!marko)[^./!]/],
    module: moduleConfig,
    resolve: resolveConfig,
    output: {
      libraryTarget: 'commonjs2',
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
    ]
  },
  {
    mode,
    name: "Browser",
    target: "web",
    entry: markoPlugin.emptyEntry,
    module: moduleConfig,
    resolve: resolveConfig,
    output: {
      publicPath: "/static/",
      path: path.join(__dirname, "dist/client"),
      filename: "[name].[contenthash:10].js"
    },
    plugins: [
      new webpack.DefinePlugin({
        "process.browser": true,
        "process.env.BUNDLE": true,
        "process.env.NODE_ENV": JSON.stringify(NODE_ENV)
      }),
      new CSSExtractPlugin({
        filename: "[contenthash:10].css"
      }),
      markoPlugin.browser
    ]
  }
];

module.exports.spawnedServer = spawnedServer;