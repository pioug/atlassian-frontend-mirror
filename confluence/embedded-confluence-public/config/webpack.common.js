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
		library: 'EmbeddedConfluence',
		libraryTarget: 'umd',
		umdNamedDefine: true,
	},

	resolve: {
		extensions: ['.ts', '.tsx', '.js', '.json'],
	},

	externals: {
		react: {
			commonjs: 'react',
			commonjs2: 'react',
			amd: 'react',
			root: 'React',
		},
		'react-dom': {
			root: 'ReactDOM',
			commonjs2: 'react-dom',
			commonjs: 'react-dom',
			amd: 'react-dom',
		},
	},

	module: {
		rules: [
			{
				test: /\.(t|j)sx?$/,
				use: [
					{
						loader: require.resolve('babel-loader'),
						options: {
							envName: 'production:es2019',
							cacheDirectory: false,
							presets: [
								'@babel/preset-env',
								'@babel/preset-flow',
								'@babel/preset-react',
								'@babel/preset-typescript',
							],
						},
					},
					{
						loader: '@compiled/webpack-loader',
						options: {
							transformerBabelPlugins: ['@atlaskit/tokens/babel-plugin'],
						},
					},
				],
				exclude: /node_modules/,
			},
		],
	},

	plugins: [],
};
