const nodeExternals = require('webpack-node-externals');
const NodemonPlugin = require('nodemon-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')

const path = require('path');

module.exports = {
  entry: {
    'server': './src/server/index.js'
  },
  target: 'node',
  node: {
    __filename: true,
    __dirname: false
  },
  externals: [nodeExternals()],
  plugins: [
    new NodemonPlugin(),
    new CopyWebpackPlugin([{
        from: './src/server/pages',
        to: './pages/'
      }
    ])
  ],
  devtool: 'sourcemap',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  }
};
