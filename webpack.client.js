const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require('path');

module.exports = {
  entry: {
    'client': './src/client/index.js',

  },
  target: 'web',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist/assets')
  },
  module: {
    rules: [{
      test: /\.css$/,
      use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
    }, {
      test: /\.(png|jpg|gif)$/,
      use: "file-loader"
    }]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    })
  ],
  devServer: {
    proxy: {
      "/api": "http://localhost:3000/",
      "/search": "http://localhost:3000/"
    }
  }
};
