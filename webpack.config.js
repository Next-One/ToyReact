const path = require('path')

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
  devtool: false
}