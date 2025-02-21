/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');

const webpack = require('webpack');
const merge = require('webpack-merge');

const commonConfig = require('./webpack.common');

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

const amdConfig = {
	output: {
		library: 'feature-gate-js-client',
		libraryTarget: 'amd',
		umdNamedDefine: true,
	},
};

module.exports = [
	// AMD with dependencies
	merge(baseConfig, amdConfig, {
		entry: {
			'feature-gate-js-client.with-deps.amd': indexPath,
		},
		optimization: {
			minimize: false,
		},
	}),

	// AMD with dependencies minified
	merge(baseConfig, amdConfig, {
		entry: {
			'feature-gate-js-client.with-deps.amd.min': indexPath,
		},
		optimization: {
			minimize: true,
		},
	}),
];
