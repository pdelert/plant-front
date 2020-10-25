const fs = require('fs');
const packageJson = fs.readFileSync('./package.json');
const version = JSON.parse(packageJson).version || 0;
const merge = require('deepmerge');

const VERSION = {
    'process.env': {
        VERSION: JSON.stringify(version)
    }
};

module.exports = {
    chainWebpack: config =>
        config
            .plugin('define')
            .tap(
                args => merge(args, [VERSION])
            ),
    publicPath: process.env.VUE_APP_PUBLIC_PATH,
    lintOnSave: process.env.NODE_ENV !== 'production',
    css: {
        sourceMap: true
    },
    productionSourceMap: false,
    runtimeCompiler: true,
    transpileDependencies: [
        /\/node_modules\/resize-detector\//
    ],
    devServer: {
        disableHostCheck: true,
        // https: {
        //     key: fs.readFileSync('./certs/localhost.key'),
        //     cert: fs.readFileSync('./certs/localhost.crt'),
        //     ca: fs.readFileSync('./certs/ca.crt')
        // },
        proxy: 'http://localhost:8081'
    }
};