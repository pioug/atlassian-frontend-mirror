const crypto = require('crypto');
const path = require('path');

/**
 * START HASH HACKS FOR NODE 18 COMPATIBILITY
 * See: https://stackoverflow.com/a/69761823
 */
const createHashOriginal = crypto.createHash;
crypto.createHash = (algorithm) => createHashOriginal(algorithm === 'md4' ? 'sha256' : algorithm);
/**
 * END HASH HACKS
 */

module.exports = {
	output: {
		path: path.join(__dirname, '../dist'),
		filename: '[name].js',
	},

	resolve: {
		extensions: ['.ts', '.js', '.json'],
	},

	module: {
		rules: [
			{
				test: /\.(t|j)sx?$/,
				use: {
					loader: require.resolve('babel-loader'),
					options: {
						envName: 'production:es2019',
						cacheDirectory: true,
						presets: ['@babel/preset-env'],
						configFile: path.join(__dirname, './babel.config.js'),
					},
				},
				exclude: /node_modules/,
			},
		],
	},

	plugins: [],
};
