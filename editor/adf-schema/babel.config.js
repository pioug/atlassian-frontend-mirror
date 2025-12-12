/* eslint-disable no-undef, require-unicode-regexp */
const fs = require('fs');
const path = require('path');

const filePathsToIgnore = [
	'node_modules',
	'**/__mocks__',
	'**/__tests__',
	'**/__fixtures__',
	/.*\.?test\.(js|ts)x?$/,
	/.*\/examples\.(ts|js)x?$/,
	/packages\/proforma\/.*\/mocks\.(ts|js)x?$/,
];

const es5Browsers = [
	'last 1 chrome versions',
	// support last non-chrome-based version of edge
	'edge >= 18',
	'last 1 firefox versions',
	'last 1 safari versions',
	'last 1 and_chr versions',
	'last 1 ios_saf versions',
	// Temporarily putting this back to fix the Confluence es5-check and satisfy Jira's "limited" IE11 support
	'ie 11',
];

/** IMPORTANT
 *  The typescript preset must be executed _before_ babel/env so that TS Class parameter property assignments are compiled correctly.
 *  We do this by placing the typescript preset after babel/env for each environment (presets are executed in reverse order). We cannot use the top-level presets field as they are executed _after_
 *  each env.
 *  https://github.com/babel/babel/issues/9105
 */

/* Typescript must also be executed before plugin-proposal-class-properties to fix another issue surrounding class property initialisation and inheritance.
 * https://github.com/babel/babel/issues/12066
 * We achieve this by creating our own preset which includes the plugin. This allows us to execute the plugins in the correct order as there is no other way to execute plugins _after_ presets.
 */
const classPropertiesPreset = {
	plugins: ['@babel/plugin-proposal-class-properties'],
};

const { name: packageName, version } = JSON.parse(
	fs.readFileSync(`${process.cwd()}/package.json`, 'utf-8'),
);
const packageVersion = version;

/**
 * Babel can't access Atlaskit packages to compile the CSS for @compiled/react
 * Hence we need to supply a custom workaround as suggested in
 * https://product-fabric.atlassian.net/browse/APP-515
 */
const compiledBabelPlugin = [
	'@compiled/babel-plugin',
	{
		babelPlugins: ['typescript'],
		resolver: {
			resolveSync: (context, request) => {
				return resolver(request, {
					basedir: path.dirname(context),
				});
			},
		},
	},
];

module.exports = {
	presets: ['@babel/react'],
	plugins: [
		'@babel/syntax-dynamic-import',
		'@babel/transform-runtime',
		compiledBabelPlugin,
		[
			'transform-define',
			{
				'process.env._PACKAGE_NAME_': packageName,
				'process.env._PACKAGE_VERSION_': packageVersion,
			},
		],
	],
	ignore: ['node_modules', '**/__tests__', '**/*.d.ts'],
	env: {
		'production:browser-cjs': {
			plugins: [
				'@babel/plugin-proposal-optional-chaining',
				'react-magnetic-di/babel-plugin',
				compiledBabelPlugin,
			],
			presets: [
				[
					'@babel/env',
					{
						bugfixes: true,
						modules: 'commonjs',
						targets: es5Browsers,
					},
				],
				classPropertiesPreset,
				'@babel/preset-typescript',
			],
			ignore: filePathsToIgnore,
		},
		'production:es2019': {
			plugins: [
				/* Transpile away these features that wouldn't otherwise with the specified browser targets below.
				 * These features break webpack 4 and the workaround of resolving its transitive acorn dep causes issues
				 * with async imports not being transpiled
				 */
				'@babel/plugin-proposal-optional-chaining',
				'@babel/plugin-proposal-nullish-coalescing-operator',
				'react-magnetic-di/babel-plugin',
				compiledBabelPlugin,
			],
			presets: [
				[
					'@babel/env',
					{
						bugfixes: true,
						modules: false,
						targets: [
							'last 1 chrome versions',
							'last 1 edge versions',
							'last 1 firefox versions',
							'last 1 safari versions',
							'last 1 and_chr versions',
							'last 1 ios_saf versions',
						],
					},
				],
				classPropertiesPreset,
				'@babel/preset-typescript',
			],
			ignore: filePathsToIgnore,
		},
		'production:esm': {
			plugins: [
				'@babel/plugin-proposal-object-rest-spread',
				'@babel/plugin-proposal-optional-chaining',
				'react-magnetic-di/babel-plugin',
				compiledBabelPlugin,
			],
			presets: [
				[
					'@babel/env',
					{
						modules: false,
						targets: es5Browsers,
					},
				],
				classPropertiesPreset,
				'@babel/preset-typescript',
			],
			ignore: filePathsToIgnore,
		},
		'production:node-cjs': {
			plugins: ['@babel/plugin-proposal-optional-chaining'],
			presets: [
				[
					'@babel/env',
					{
						modules: 'commonjs',
						targets: es5Browsers,
					},
				],
				'@babel/preset-typescript',
			],
			ignore: filePathsToIgnore,
		},
	},
};
