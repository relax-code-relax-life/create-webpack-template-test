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
                        preamble: banner,
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
            new OptimizeCSSAssetsPlugin({})
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
                                "useESModules": true
                                // corejs   undefined | false | 2 | '2' 是否ployfill使用到的内建方法，例如Map,Promise,Object.assign，如果是2，则需要npm install @babel/runtime-corejs2
                                // helpers  是否使用@babel/runtime-corejs2替换每个文件的帮助代码，例如_classCallCheck3。
                                // regenerator  是否@babel/runtime-corejs2替换async,generator的ployfill方法
                                // useESModules 是否加载esm形式的帮助代码，帮助代码的默认加载路径为runtime/helpers/**，为true时的加载路径为runtime/helpers/esm
                                //              默认路径的代码形式为module.exports = xx
                                //              esm下的代码形式为: export default xx
                            }]
                        ],
                        presets: [
                            ['@babel/preset-env', {
                                targets: {"ie": "9"},
                                loose: false,
                                modules: 'auto'
                                // targets: {chrome:58} | "> 5% in alt-AS" | "> 5%" | "cover 99.5%" | "last 2 major versions"
                                //          valid environments: chrome, opera, edge, firefox, safari, ie, ios, android, node, electron
                                // modules  "amd" | "umd" | "systemjs" | "commonjs" | "cjs" | "auto" | false
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
        }),
        new webpack.BannerPlugin({banner: banner, raw: true})
    ]
}