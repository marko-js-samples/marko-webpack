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
        extensions: ['', '.js', '.marko'],
        modulesDirectories: [
			'./',
			'node_modules'
		]
    },
    module: {
        loaders: [
            {
                test: /\.marko$/,
                loader: 'marko-loader'
            },
            {
                test: /\.(less|css)$/,
                loader: ExtractTextPlugin.extract("style?sourceMap", "css?sourceMap!less")
            },
            {
                test: /\.svg/,
                loader: 'svg-url-loader'
            }
        ]
    },
    plugins: [
            // Avoid publishing files when compilation failed:
            new webpack.NoErrorsPlugin(),

            // Aggressively remove duplicate modules:
            new webpack.optimize.DedupePlugin(),

            // Write out CSS bundle to its own file:
            new ExtractTextPlugin('static/bundle.css', { allChunks: true })
    ]
};
