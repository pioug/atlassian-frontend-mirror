/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const { moduleResolveMapBuilder } = require('@atlassian/multi-entry-tools');

const webpack = require('webpack');
const merge = require('webpack-merge');

const commonConfig = require('./webpack.common');
const { copyBundleToPageEntries } = require('./copyBundleToPageEntries');

const indexPath = path.resolve(__dirname, '../src/index.ts');

class CopyBundleToPageEntriesPlugin {
	apply(compiler) {
		compiler.hooks.afterEmit.tap('CopyBundleToPageEntriesPlugin', () => {
			copyBundleToPageEntries(compiler.options.output.path);
		});
	}
}

const baseConfig = merge(commonConfig, {
	mode: 'production',
	plugins: [
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify('production'),
			},
		}),
		new CopyBundleToPageEntriesPlugin(),
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
	});
};
