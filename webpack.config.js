const path = require('path')

module.exports = {
  mode: 'development',
  entry: [
    './main.js',
  ],
  output: {
      filename: 'main_interp.js'
  },
  resolve: {},
  module: {},
  watch: true,
  watchOptions: {
    aggregateTimeout: 600,
    poll: 100
  },
};
