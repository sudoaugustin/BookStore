const path = require("path");

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
  entry: {
    index: "./module/index.js",
    config: "./module/config.js",
  },
  output: {
    path: path.resolve(__dirname, "src"),
  },
};
