const path = require('path')

const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: {
    main: path.resolve(__dirname, 'src', 'index.js')
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            // presets: ['@babel/preset-env'],
            plugins: [['@babel/plugin-transform-react-jsx',{pragma: 'createElement'}]]
          }
        }
      }
    ]
  },
  mode: "development",
  optimization: {
    minimize: false
  },
  resolve: {
    extensions: ['.js','jsx']
  },
  devtool: false,
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({title: 'ToyReact'})
  ],
  devServer: {
    contentBase: './dist'
  }
}