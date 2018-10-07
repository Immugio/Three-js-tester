const path = require("path");
const webpack = require("webpack");
const CleanWebpackPlugin = require("clean-webpack-plugin");

module.exports = env => {

    if (!env.mode) {
        process.exit(1);
    }

    return {

        mode: env.mode,
        entry: {
            app: "./src/App.ts"
        },
        externals: {
            "three": "THREE",
            "detector": "Detector"
        },
        devtool: env.mode === "development" ? "inline-source-map" : false,
        devServer: {
            contentBase: "./",
            hot: true,
            openPage: "index.html"
        },
        plugins: [
            new CleanWebpackPlugin(["build/*"]),
            new webpack.HotModuleReplacementPlugin()
        ],
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: "ts-loader",
                    include: path.resolve(__dirname, "src")
                },
                {
                    test: /\.svg$/,
                    use: "file-loader",
                    include: path.resolve(__dirname, "src")
                }
            ]
        },
        resolve: {
            extensions: [".tsx", ".ts", ".js"]
        },
        output: {
            filename: "[name].js",
            path: path.resolve(__dirname, "build")
        }
    }
};