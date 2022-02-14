const path = require('path');

const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, '../dist/tokens-browser-extension/src'),
    filename: 'index.js',
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.(js|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/react',
              [
                '@babel/env',
                {
                  bugfixes: true,
                  modules: false,
                  targets: ['last 1 chrome versions'],
                },
              ],
              '@babel/preset-typescript',
            ],
            plugins: ['@babel/transform-runtime'],
          },
        },
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: './',
          to: '../',
          globOptions: {
            ignore: ['**/src/**', '**/node_modules/**'],
          },
        },
      ],
    }),
  ],
};
