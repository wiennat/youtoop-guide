const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');

const path = require('path');

module.exports = {
  entry: {
    'client': './src/client/index.js',
  },
  target: 'web',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist/public/assets/'),
    publicPath: '/assets/'
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
    new CopyWebpackPlugin([{
      from: './src/client/public',
      to:  path.resolve(__dirname, 'dist/public')
    }]),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    })
  ],
  devServer: {
    contentBase: path.resolve(__dirname, 'src/client/public'),
    proxy: {
      "/api": "http://localhost:3000/",
      "/search": "http://localhost:3000/"
    }
  }
};
