const path = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies
const webpack = require('webpack');
// eslint-disable-next-line import/no-extraneous-dependencies
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {
  createBaseEditorMobileBridgeWebpackConfig,
} = require('./build/webpack_base_config');

module.exports = async function createWebpackConfig(_, args) {
  return createBaseEditorMobileBridgeWebpackConfig(args, {
    entry: {
      editor: path.join(__dirname, '/src/editor/index.tsx'),
      renderer: path.join(__dirname, '/src/renderer/index.tsx'),
      'error-reporter': path.join(__dirname, '/src/error-reporter.ts'),
    },
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'dist/bundle'),
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.join(__dirname, 'public/editor.html.ejs'),
        chunks: ['error-reporter', 'editor'],
        chunksSortMode: 'manual',
        filename: 'editor.html',
      }),
      new HtmlWebpackPlugin({
        template: path.join(__dirname, 'public/renderer.html.ejs'),
        chunks: ['error-reporter', 'renderer'],
        chunksSortMode: 'manual',
        filename: 'renderer.html',
      }),
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1,
      }),
    ],
    devServer: {
      contentBase: path.join(__dirname, 'dist/bundle'),
    },
  });
};
