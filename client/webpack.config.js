const path = require("path");
const entryFiles = {
  login: "./es6/login.js",
  index: "./es6/index.js",
};
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        loader: "url-loader?limit=100000",
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },
    ],
  },
  mode: "development",
  entry: entryFiles,
  output: {
    path: path.resolve(__dirname, "src"),
  },
};
