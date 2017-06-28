
var path = require("path");
var webpack = require("webpack");
module.exports = [{
    entry: {
        main: path.join(__dirname, "src/main.ts")
    },
    output: {
        path: path.join(__dirname, "dist"),
        filename: "[name].js",
        chunkFilename: "[chunkhash].js"
    },
    module: {
        loaders: [
            {
                test: /\.tsx?$/,
                use: "ts-loader"
            }
        ]
    },
    plugins: [

    ]
}];
