/**
 * @author liumengniu
 * @Date: 2021-7-3
 */

const path = require("path");

module.exports = {
  devServer: {
    port: 5050
  },
  webpack: {
    publicPath: "./",
    alias: {
      "@": path.resolve("src"),
      "@statics": path.resolve(__dirname, "src/statics"),
      "@views": path.resolve(__dirname, "src/views"),
      "@comp": path.resolve(__dirname, "src/components"),
      "@services": path.resolve(__dirname, "src/services"),
      "@utils": path.resolve(__dirname, "src/utils"),
      "@redux": path.resolve(__dirname, "src/redux"),
      "@styles": path.resolve(__dirname, "src/styles")
    },
  },
  eslint: {
    enable: false,
  },
};
