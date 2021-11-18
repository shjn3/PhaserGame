const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: "./src/main.ts",
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        include: [path.resolve(__dirname, "src")],
      },
    ],
  },
  resolve: {
    extensions: ["", ".js", ".jsx", ".ts", ".tsx"],
  },
  mode: "development",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "public"),
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: "src/index.html",
    }),
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [{ from: "assets", to: "assets" }],
    }),
  ],
};
