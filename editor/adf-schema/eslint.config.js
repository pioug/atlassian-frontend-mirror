// Import the ESLint plugin locally
const tsParser = require('@typescript-eslint/parser');
const warnSchemaEslintPlugin = require('./eslint-plugin-warn-schema');

module.exports = [
	{
		files: ['**/*.ts'],
		languageOptions: {
			parser: tsParser,
		},
		// Using the eslint-plugin-example plugin defined locally
		plugins: { warnSchemaPlugin: warnSchemaEslintPlugin },
		rules: {
			'warnSchemaPlugin/warn-schema-change': 'warn',
		},
	},
];
