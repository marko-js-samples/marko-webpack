'use strict';
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: "./src/pages/home/client.js",
    output: {
        path: __dirname,
        filename: "static/bundle.js"
    },
    resolve: {
        extensions: ['.js', '.marko'],
        modules: ['./', 'node_modules']
    },
    module: {
        rules: [
            {
                test: /\.marko$/,
                use: 'marko-loader'
            },
            {
                test: /\.(less|css)$/,
                use: ExtractTextPlugin.extract({ fallback: "style-loader?sourceMap", use: ["css-loader?sourceMap", "less-loader"] })
            },
            {
                test: /\.svg/,
                use: 'svg-url-loader'
            },
            {
                test: /\.(jpg|jpeg|gif|png)$/,
                use: {
                  loader: 'file-loader',
                  options: {
                      name: 'static/images/[hash].[ext]',
                      publicPath: '/'
                  }
                },
            }
        ]
    },
    plugins: [
            // Avoid publishing files when compilation failed:
            new webpack.NoEmitOnErrorsPlugin(),

            // Write out CSS bundle to its own file:
            new ExtractTextPlugin({ filename: 'static/bundle.css', allChunks: true })
    ]
};
