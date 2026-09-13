import { type Linter } from 'eslint';

const recommended: Linter.BaseConfig = {
	plugins: ['no-lookahead-lookbehind-regexp'],
	env: {
		browser: true,
	},
	rules: {
		'no-lookahead-lookbehind-regexp/no-lookahead-lookbehind-regexp': 'error',
	},
};

export { recommended };
