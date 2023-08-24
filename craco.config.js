/**
 * @author liumengniu
 * @Date: 2021-7-3
 */

const path = require("path");
const webpack = require("webpack");
const { whenProd } = require("@craco/craco")
const TerserPlugin = require("terser-webpack-plugin")

module.exports = {
  devServer: {
    port: 5050
  },
  webpack: {
    publicPath: "./",
    configure: (webpackConfig, {env, paths}) => {
      webpackConfig.resolve.fallback = {
        "buffer": require.resolve("buffer")
      };
      webpackConfig.module.rules.push(
        {
          test: /\.m?js$/,
          resolve: {
            fullySpecified: false
          },
        }),
      webpackConfig.ignoreWarnings = [/Failed to parse source map/];
      whenProd(() => {
        webpackConfig.optimization.minimize = true
        webpackConfig.optimization.minimizer.map(plugin => {
          if (plugin instanceof TerserPlugin) {
            Object.assign(plugin.options.minimizer.options.compress, {
              drop_debugger: true, // 删除 debugger
              drop_console: true, // 删除 console
              pure_funcs: ["console.log"]
            })
          }
          return plugin
        })
        webpackConfig.optimization.runtimeChunk = "single"
        webpackConfig.optimization.splitChunks = {
          ...webpackConfig.optimization.splitChunks,
          chunks: "all",
          minSize: 30000,
          maxAsyncRequests: 30,
          maxInitialRequests: 30,
          cacheGroups: {
            defaultVendors: {
              test: /[\\/]node_modules[\\/]/,
              name: "vendors"
            },
            antd: {
              test: /lodash/,
              name: "lodash",
              priority: 90
            },
            echarts: {
              test: /ahooks/,
              name: "ahooks",
              priority: 90
            },
            base: {
              chunks: "all",
              test: /(react|react-dom|react-dom-router)/,
              name: "base",
              priority: 100
            },
            commons: {
              chunks: "all",
              minChunks: 2,
              name: "commons",
              priority: 110
            }
          }
        }
      })
      return webpackConfig;
    },
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
    plugins: [
      new webpack.ProvidePlugin({
        process: "process/browser",
        Buffer: ["buffer", "Buffer"],
      }),
    ]
  },
  eslint: {
    enable: false,
  },
};
