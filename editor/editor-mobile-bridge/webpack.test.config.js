/* eslint import/no-extraneous-dependencies: 0*/
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {
  createBaseEditorMobileBridgeWebpackConfig,
} = require('./build/webpack_base_config');

module.exports = async function createWebpackConfig(_, args) {
  return createBaseEditorMobileBridgeWebpackConfig(args, {
    entry: {
      editorTestSetup: path.join(
        __dirname,
        '/src/__tests__/integration-webview/_mocks/editorTestSetup.ts',
      ),
      editor: path.join(
        __dirname,
        '/src/__tests__/integration-webview/_mocks/editor-component.tsx',
      ),
      renderer: path.join(
        __dirname,
        '/src/__tests__/integration-webview/_mocks/renderer-component.tsx',
      ),
    },
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'dist/test/bundle'),
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.join(__dirname, 'public/editor.html.ejs'),
        chunks: ['editor', 'editorTestSetup'],
        chunksSortMode: 'manual',
        filename: 'editor.html',
      }),
      new HtmlWebpackPlugin({
        template: path.join(__dirname, 'public/renderer.html.ejs'),
        chunks: ['renderer', 'editorTestSetup'],
        chunksSortMode: 'manual',
        filename: 'renderer.html',
      }),
    ],
    devServer: {
      contentBase: path.join(__dirname, 'dist/test/bundle'),
    },
  });
};
