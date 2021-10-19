/* eslint-disable */
var config = require("./config");
var webpack = require("webpack");
var merge = require("webpack-merge");
var baseWebpackConfig = require("./webpack.base.conf");
var HtmlWebpackPlugin = require("html-webpack-plugin");
const FriendlyErrorsPlugin = require("friendly-errors-webpack-plugin");
var BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
    .BundleAnalyzerPlugin;

// add hot-reload entry
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
    baseWebpackConfig.entry[name] = ["./configs/dev-client"].concat(
        baseWebpackConfig.entry[name]
    );
});

var webpackConfig = merge(baseWebpackConfig, {
    mode: "development",
    devtool: "source-map",
    stats: "minimal",
    plugins: [
        // HMR
        new webpack.HotModuleReplacementPlugin({}),

        new webpack.DefinePlugin({
            "process.env": {
                VUE_APP_UUAP_URL: '"https://itebeta.baidu.com"',
                NODE_ENV: '"development"',
            },
        }),
        // https://github.com/ampedandwired/html-webpack-plugin
        new HtmlWebpackPlugin({
            filename: "index.html",
            template: "index.html",
            favicon: "src/assets/favicon.ico",
            inject: true,
        }),
        new FriendlyErrorsPlugin(),

        // new BundleAnalyzerPlugin()
    ],
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/](?!noahv|iview|vue|echarts|moment)\.js$/,
                    name: "vendors",
                    chunks: "all",
                },
                visual_vendors: {
                    test: /[\\/]node_modules[\\/]echarts|moment[\\/]\.js$/,
                    name: "visual_vendors",
                    chunks: "all",
                },
            },
        },
    },
});

if (config.dev.cssExtract) {
    var MiniCssExtractPlugin = require("mini-css-extract-plugin");
    var path = require("path");
    webpackConfig.plugins.push(
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[name].css",
        })
    );
}

module.exports = webpackConfig;
