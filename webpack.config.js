const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const webpack = require("webpack");
const path = require("path");

module.exports = env => {

    if (!env.mode) {
        process.exit(1);
    }

    return {

        mode: env.mode,
        entry: {
            app: "./src/App.ts",
            crossDot: "./src/CrossDot.ts"
        },
        devtool: env.mode === "development" ? "inline-source-map" : false,
        devServer: {
            contentBase: "./",
            hot: true,
            openPage: "index.html",
            port: 9500
        },
        plugins: [
            new CleanWebpackPlugin(["build/*"]),
            new webpack.HotModuleReplacementPlugin(),
            new ForkTsCheckerWebpackPlugin({ workers: 2 })
        ],
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    loader: "ts-loader",
                    include: path.resolve(__dirname, "src"),
                    options: { transpileOnly: true }
                },
                {
                    test: /\.(svg|mov|mp4|ogv|webbm|png)$/,
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