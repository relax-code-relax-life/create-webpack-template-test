module.exports={
    plugins: [
        ["@babel/plugin-transform-runtime", {
            "corejs": false,
            "helpers": true,
            "regenerator": true,
            "useESModules": true
            // corejs   undefined | false | 2 | '2' 是否ployfill使用到的内建方法，例如Map,Promise,Object.assign
            // helpers  是否使用@babel/runtime-corejs2替换每个文件的帮助代码，例如_classCallCheck3。
            // regenerator  是否@babel/runtime-corejs2替换async,generator的ployfill方法
            // useESModules 是否加载esm形式的帮助代码，帮助代码的默认加载路径为@babel/runtime-corejs2/helpers/**，为true时的加载路径为@babel/runtime-corejs2/helpers/esm
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