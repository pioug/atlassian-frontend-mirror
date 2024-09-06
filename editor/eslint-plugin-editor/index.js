/* eslint-disable global-require */
module.exports = {
	rules: {
		'warn-no-restricted-imports': require('./rules/warn-no-restricted-imports'),
		'no-as-casting': require('./rules/no-as-casting'),
		'only-export-plugin': require('./rules/only-export-plugin'),
	},
};
