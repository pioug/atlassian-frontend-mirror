const path = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies
const webpack = require('webpack');
// eslint-disable-next-line import/no-extraneous-dependencies
const HtmlWebpackPlugin = require('html-webpack-plugin');
// eslint-disable-next-line import/no-extraneous-dependencies
const moduleResolveMapBuilder = require('@atlaskit/multi-entry-tools/module-resolve-map-builder');
const { PORT } = require('./build/utils');

module.exports = async function createWebpackConfig(_, args) {
  const mode = typeof args.mode === 'undefined' ? 'development' : args.mode;
  const emptyExportPath = require.resolve('./empty');
  const devtool =
    mode === 'development' && typeof args.devtool !== 'string'
      ? 'source-map'
      : args.devtool;

  return {
    mode,
    entry: {
      editor: path.join(__dirname, '/src/editor/index.tsx'),
      editorarchv3: path.join(__dirname, '/src/editor-arch-v3.tsx'),
      renderer: path.join(__dirname, '/src/renderer/index.tsx'),
      'error-reporter': path.join(__dirname, '/src/error-reporter.ts'),
    },
    stats: {
      warnings: false,
    },
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'dist/bundle'),
    },
    devtool,
    resolve: {
      mainFields: ['atlaskit:src', 'module', 'browser', 'main'],
      extensions: ['.js', '.json', '.ts', '.tsx'],
      alias: {
        ...(await moduleResolveMapBuilder()),
        '@atlaskit/media-editor': emptyExportPath, // ~145kb gzip
        '@atlaskit/media-viewer': emptyExportPath, // ~335kb gzip
        '@atlaskit/avatar': emptyExportPath, // ~7.5kb gzip
        '@atlaskit/avatar-group': emptyExportPath, // ~2kb gzip
        '@atlaskit/profilecard': emptyExportPath, // ~7kb gzip
        '@atlaskit/select': emptyExportPath,
        'react-select': emptyExportPath, // ~20kb gzip
        'components/picker/EmojiPicker': emptyExportPath,
        'react-virtualized/dist/commonjs/AutoSizer': emptyExportPath, // Official way of importing these components
        'react-virtualized/dist/commonjs/Collection': emptyExportPath, // from react-virtualized to avoid treeshaking issues
        'react-virtualized/dist/commonjs/List': emptyExportPath, // ~10kb gzip
        'react-virtualized': emptyExportPath, // ~10kb gzip
      },
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: require.resolve('babel-loader'),
          options: {
            cacheDirectory: true,
            babelrc: true,
            rootMode: 'upward',
            envName: 'production:esm',
          },
        },
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          loader: require.resolve('ts-loader'),
          options: {
            transpileOnly: true,
            compilerOptions: {
              module: 'ESNext',
              target: 'es5',
            },
          },
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.join(__dirname, 'public/editor.html.ejs'),
        chunks: ['error-reporter', 'editor'],
        chunksSortMode: 'manual',
        filename: 'editor.html',
      }),
      new HtmlWebpackPlugin({
        template: path.join(__dirname, 'public/editor.html.ejs'),
        chunks: ['error-reporter', 'editorarchv3'],
        chunksSortMode: 'manual',
        filename: 'editorarchv3.html',
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
    optimization: {
      nodeEnv: mode,
      splitChunks: false,
    },
    devServer: {
      host: '0.0.0.0',
      allowedHosts: [
        // Variations of Localhost
        'localhost',
        '127.0.0.0',
        // Used on BrowserStack
        'bs-local.com',
        // Used for Android
        '10.0.2.2',
        '.ngrok.io',
      ],
      port: PORT,
      contentBase: path.join(__dirname, 'dist/bundle'),
    },
  };
};
