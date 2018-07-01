const path = require('path');

const config = {
  mode: 'development',
  entry: path.resolve(__dirname, 'src/index.jsx'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js'
  },
  module: {
    rules:[{
      test: /\.jsx$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['env', 'react'],
          plugins: [
            'transform-decorators-legacy',  // 装饰器
            'transform-class-properties',   // 类属性
          ]
        }
      }
    }]
  },
  devtool: 'inline-source-map'
}

module.exports = config;