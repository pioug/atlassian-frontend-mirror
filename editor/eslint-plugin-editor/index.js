/* eslint-disable global-require */
// Ignored via go/ees005
// eslint-disable-next-line import/no-commonjs
module.exports = {
	rules: {
		// Ignored via go/ees005
		// eslint-disable-next-line import/no-commonjs
		'warn-no-restricted-imports': require('./rules/warn-no-restricted-imports'),
		// Ignored via go/ees005
		// eslint-disable-next-line import/no-commonjs
		'no-as-casting': require('./rules/no-as-casting'),
		// Ignored via go/ees005
		// eslint-disable-next-line import/no-commonjs
		'only-export-plugin': require('./rules/only-export-plugin'),
		// Ignored via go/ees005
		// eslint-disable-next-line import/no-commonjs
		'no-re-export': require('./rules/no-re-exports').rule,
		// Ignored via go/ees005
		// eslint-disable-next-line import/no-commonjs
		'no-htmlElement-assignment': require('./rules/no-htmlElement-assignment').rule,
		// Ignored via go/ees005
		// eslint-disable-next-line import/no-commonjs
		'enforce-plugin-structure': require('./rules/enforce-plugin-structure'),
		// Ignored via go/ees005
		// eslint-disable-next-line import/no-commonjs
		'enforce-todo-comment-format': require('./rules/enforce-todo-comment-format').rule,
	},
};
