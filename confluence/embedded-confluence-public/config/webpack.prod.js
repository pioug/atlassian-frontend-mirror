/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const { moduleResolveMapBuilder } = require('@atlassian/multi-entry-tools');

const webpack = require('webpack');
const merge = require('webpack-merge');

const commonConfig = require('./webpack.common.js');

const indexPath = path.resolve(__dirname, '../src/index.ts');

const baseConfig = merge(commonConfig, {
  mode: 'none',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
  ],
});

module.exports = async () => {
  return merge(baseConfig, {
    entry: {
      'embedded-confluence-bundle': indexPath,
    },
    resolve: {
      alias: {
        ...(await moduleResolveMapBuilder({
          addDefaultEntries: true,
        })),
      },
    },
    optimization: {
      minimize: true,
    },
  });
};
