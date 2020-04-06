const path = require("path");

module.exports = {
  mode: "development",
  entry: {
    index: "./module/index.js",
    config: "./module/config.js"
  },
  output: {
    path: path.resolve(__dirname, "src")
  }
};
