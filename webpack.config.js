const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
    clean: true
  },
  devtool:'source-maps',
  plugins:[
  new CopyPlugin({
    patterns:[{from:'public'}],
  }),
  ]
};
