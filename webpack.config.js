'use strict';
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");


module.exports = {
    mode: process.env.NODE_ENV || "development",
    // Add source map support
    devtool: "#cheap-source-map",
    entry: [
    // Add the client which connects to our middleware
    // You can use full urls like 'webpack-hot-middleware/client?path=http://localhost:3000/__webpack_hmr'
    // useful if you run your app from another point like django
    "webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000",
    "./src/pages/home/client.js"
    ],
    output: {
        path: __dirname,
        filename: "static/bundle.js",
        publicPath: "/"
    },
    resolve: {
        extensions: ['.js', '.marko'],
        modules: ['./', 'node_modules']
    },
    module: {
        rules: [
            {
                test: /\.marko$/,
                loader: 'marko-loader'
            },
            {
                test: /\.(less|css)$/,
                loader: ExtractTextPlugin.extract({ fallback: 'style-loader?sourceMap', use: 'css-loader?sourceMap!less-loader' })
            },
            {
                test: /\.svg/,
                loader: 'svg-url-loader'
            },
            {
                test: /\.(jpg|jpeg|gif|png)$/,
                loader: 'file-loader',
                query: {
                    name: 'static/images/[hash].[ext]',
                    publicPath: '/'
                }
            }
        ]
    },
    plugins: [
            // Avoid publishing files when compilation failed:
            new webpack.NoEmitOnErrorsPlugin(),

            new webpack.HotModuleReplacementPlugin(),

            // Write out CSS bundle to its own file:
            new ExtractTextPlugin({ filename: 'static/bundle.css', allChunks: true })
    ]
};