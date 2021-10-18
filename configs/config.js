/* eslint-disable */
// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path');
var assetsPublicPath = '/';

var proxyTable = {};
try {
    var devProxyConfigs = require('./devProxy');
    proxyTable = devProxyConfigs.proxy;
} catch (err) {
    console.log('proxy file not existed');
}

module.exports = {
    build: {
        env: {
            NODE_ENV: '"production"'
        },
        index: path.resolve(__dirname, '../noahv/index.html'),
        assetsRoot: path.resolve(__dirname, '../noahv'),
        assetsSubDirectory: 'static',
        assetsPublicPath: assetsPublicPath,
        productionSourceMap: false,
        productionGzip: true,
        productionGzipExtensions: ['js', 'css']
    },
    dev: {
        env: {
            NODE_ENV: '"development"'
        },
        port: 8081,
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        proxyTable: proxyTable,
        cssExtract: false,
        cssSourceMap: true
    }
};
