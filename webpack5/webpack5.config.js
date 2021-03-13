const {resolve} = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin');
const HTMLInlineCSSWebpackPlugin = require("html-inline-css-webpack-plugin").default;
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
    mode: 'production',
    // mode: 'none',
    entry: {
        // home: resolve(__dirname, 'src/app.js'), //这里如果是相对路径，是相对于代码运行的process.cwd()
        home: resolve(__dirname, 'src/a.ts')
    },
    output: {
        clean: true,
        filename: "[name][contenthash].js", // 测试，在a.js中引入css和删除css，打包出的home.js的contenthash保持不变
        path: resolve(__dirname, './dist'), // webpack要求必须绝对路径
        publicPath: "./"
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name][contenthash].css'
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: resolve(__dirname, './src/index.html'),
            templateParameters: {users: ['wwl', 'lin']}
        }),
        // new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/home.+\.js/]), // 将script内联到html文件中
        // new HTMLInlineCSSWebpackPlugin({        //将css内联到html文件中
        //     filter(fileSrc) {
        //         // 这里既过滤html文件，也过滤html中的css文件
        //         // 如果fileSrc是css路径，则为在html中引用的路径
        //         return fileSrc === 'index.html' || /home.*\.css/.test(fileSrc);
        //     },
        //     leaveCSSFile: false     // 如果为true，会在dist/中保留内联的css文件，如果为false，会把已内联的css文件从dist/中删除
        // }),

    ],
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    module: {
        rules: [
            {
                test: /\.less$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader'],
            },
            {
                test: /\.(eot|ttf|woff)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'font/[hash][ext]',
                },
            },
            {
                test: /\.(png|jpg|jpeg|gif)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'images/[hash][ext]',
                },
            },
            {
                test: /\.tsx?$/,
                use: ['ts-loader'],
                exclude: /node_modules/,
                // 如果使用了babel，则就不使用ts-loader，
                //  而是使用babel里的 @babel/plugin-transform-typescript或@babel/preset-typescript
            },
        ],
    },
    optimization: {
        minimizer: [
            // 默认TerserPlugin不去除console.*
            // new TerserPlugin({terserOptions: {compress: {drop_console: true}}}),
            '...',
            new CssMinimizerPlugin()
        ]
        // 如果不需要单独指定TerserPlugin，则可以使用 [ '...', new CssMinimizerPlugin() ]
        // '...'代表已有的minimizer，即在已有的minimizer上追加cssMinimizer
    }
}
