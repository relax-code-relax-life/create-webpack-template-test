const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const env = process.env.NODE_ENV === 'production' ? 'production' : 'development';
const outputPath = __dirname + '/dist';

const banner = `/*! http://wangwl.net */`;
const devMode = env === 'development';

module.exports = {
    mode: devMode ? 'none' : env,
    entry: {
        app: './src/index.js'
    },
    output: {
        path: outputPath,
        filename: '[name][hash:8].js',
        // publicPath: ''
    },
    optimization: {
        minimize: !devMode,
        minimizer: [
            new UglifyJSPlugin({
                uglifyOptions: {
                    output: {
                        comments: false,
                        // preamble: banner,
                        beautify: false,
                        ascii_only: true
                    },
                    compress: {
                        drop_console: true,
                        drop_debugger: true,
                        properties: true,
                        evaluate: true
                    },
                    warnings: true
                }
            }),
            new OptimizeCSSAssetsPlugin({}),
            new webpack.BannerPlugin({banner: banner, raw: true})
        ],

    },
    module: {
        rules: [
            // use: 倒序执行
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: [{
                    loader: 'babel-loader', // 执行顺序 plugins(正序) --> presets(倒序)
                    options: {
                        envName: env,
                        plugins: [
                            ["@babel/plugin-transform-runtime", {
                                "corejs": false,
                                "helpers": true,
                                "regenerator": true,
                                "useESModules": false
                                // corejs   undefined | false | 2 | '2' 是否ployfill使用到的内建方法。
                                //          对于该文件使用的内置方法和类型，例如Map,Promise,Object.assign，默认不转换，
                                //          如果设置为2，则使用@babel/runtime-corejs2/core-js/**替换对应的内置方法和类型。
                                //          同时，以下helpers,regenerator,userESModules参数对应添加到代码中的引用为 @babel/runtime/**
                                //          如果设置为2，则以下参数添加到代码中的引用使用@babel/runtime-corejs2/**
                                //              注意：
                                //                  @babel/runtime-corejs2/**和core-js/modules/**不影响，
                                //                  env的useBuiltIns参数，会对应添加core-js/modules/**路径下的引用，该corejs参数对这个引用不影响。
                                // helpers  是否使用@babel/runtime替换每个文件的帮助代码，例如_classCallCheck3。
                                // regenerator  是否@babel/runtime替换async,generator的ployfill方法
                                //              代码中会把async,await转换成对应的_regeneratorRuntime提供的方j法。
                                //              如果为false, 则认为_regeneratorRuntime为全局变量
                                //              如果为true,则会在首部添加 import _regeneratorRuntime from '@babel/runtime/regenerator'
                                // useESModules 是否加载esm形式的帮助代码，帮助代码的默认加载路径为@babel/runtime-corejs2/helpers/**，为true时的加载路径为@babel/runtime-corejs2/helpers/esm
                                //              默认路径的代码形式为module.exports = xx
                                //              esm下的代码形式为: export default xx
                            }]
                        ],
                        presets: [
                            ['@babel/preset-env', {
                                targets: {"ie": "9"},
                                loose: true,
                                modules: false,
                                useBuiltIns: 'entry'
                                // targets: {chrome:58} | "> 5% in alt-AS" | "> 5%" | "cover 99.5%" | "last 2 major versions"
                                //          valid environments: chrome, opera, edge, firefox, safari, ie, ios, android, node, electron
                                // modules  "amd" | "umd" | "systemjs" | "commonjs" | "cjs" | "auto" | false
                                //          配置如何转换es6模块语法，如果为false则不转换，交由webpack处理。
                                //          'auto'|'commonjs'时，会将export default 转换为`export.__esModule=true;export.default=_value;`
                                //          false时，不转换export default
                                //          不管是false|'auto'|'commonjs'，都会将import转换为require
                                // useBuiltIns  "usage" | "entry" | false, defaults to false.
                                //          配置env如何处理ployfill，默认false为不处理
                                //          'usage': 在该文件对用到的特性添加引用ployfill，(import "core-js/**")
                                //          'entry': 替换import '@babel/polyfill'为一堆 import "core-js/**"
                            }]
                        ]
                    }
                }]
            },
            {
                test: /\.(eot|ttf|woff|woff2|pdf|doc|zip|mp3)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        // name:'dirname/[name][hash:8].[ext]',
                        // outputPath:'static/assets',
                        // publicPath:'./'
                    }
                }],
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 8192,
                        // fallback:'file-loader',  // 默认file-loader，如果size>limit，会把options传给file-loader
                        // mimetype: 'image/png'
                    }
                }]
            },
            {
                test: /\.css$/,
                use: [
                    devMode ? 'style-loader' : {
                        loader: MiniCssExtractPlugin.loader,
                        // options: {publicPath: '../'} // 默认使用webpackOptions.output.publicPath
                    },
                    'css-loader']
            },
            {
                test: /\.less$/,
                use: [
                    devMode ? 'style-loader' : {
                        loader: MiniCssExtractPlugin.loader,
                        // options: {publicPath: '../'}
                    },
                    'css-loader',
                    'less-loader'
                ],
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin([outputPath], {allowExternal: false}),
        new webpack.DefinePlugin({ // 会把value直接作为代码块添加在代码中。 例如设置PRODUCTION:"true"，则代码: if(PRODUCTION) 会被转换为 if(true)
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'templates/index.html',
            // favicon: './src/favicon',
            minify: !devMode
        }),
        new MiniCssExtractPlugin({
            filename: "[name][hash:8].css",
            chunkFilename: "[id][hash:8].css"
        })
    ]
}