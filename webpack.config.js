const webpack = require('webpack')
const path = require('path')

const name = 'AuthLogicMonitor'

const production = process.env.NODE_ENV === 'production'

module.exports = {
    target: 'node-webkit',
    mode: 'production',
    entry: [
        './src/AuthLogicMonitor.js'
    ],
    output: {
        path: path.join(__dirname,
            './build/ch.nexellent.AuthLogicMonitor'),
        pathinfo: true,
        publicPath: '/build/',
        filename: name + '.js'
    },
    module: {
        rules: [{
            test: /\.m?js$/,
            exclude: /(node_modules|bower_components)/,
            /*
            include: [
                path.resolve(__dirname, 'src'),
            ],
            */
            use: {
                loader: 'babel-loader',
                options: {
                    "presets": [
                        ["@babel/preset-env", { "modules": false }]
                    ],
                    "plugins": [
                        ["@babel/plugin-proposal-decorators", { "legacy": true }],
                        "@babel/plugin-transform-runtime",
                        "@babel/plugin-proposal-class-properties"
                    ]
                }
            }
        }]
    }
}