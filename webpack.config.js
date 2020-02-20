var path = require("path");

module.exports = {
  mode: "development",
  entry: "./index.js",
  resolve: {
    extensions: [".hbs", ".css", ".js"]
  },
  module: {
    rules: [{ test: /.hbs$/, loader: "handlebars-loader" }]
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist")
  },
  node: {
    fs: "empty",
    net: "empty"
  }
};
