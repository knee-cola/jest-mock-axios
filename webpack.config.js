const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const srcDir = './lib/';
const destDir = 'dist';

module.exports = {
  entry: {
    "index": srcDir+"index.ts",
  },
  output: {
    path: path.resolve(__dirname + '/' + destDir),
    filename: 'index.js',
    library: 'jest-mock-axios',
    libraryTarget: 'umd'
  },

  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: [".ts", ".tsx", ".js", ".json"]
  },

  devtool: 'source-map',

  module: {
    rules: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      }
    ]
  },
  externals: {
    'jest-mock-promise': 'jest-mock-promise'
  },
  plugins: [
    new CleanWebpackPlugin(destDir)
  ]
};
