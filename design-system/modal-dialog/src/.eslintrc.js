module.exports = {
	rules: {
		// Pragmatic drag and drop is allowed to use the web platform directly 🚀
		'@atlaskit/design-system/no-direct-use-of-web-platform-drag-and-drop': 'off',
		// We have non-react outputs inside of Pragmatic drag and drop
		'testing-library/no-dom-import': 'off',
		// We need extreme control over event flows in tests
		'testing-library/prefer-user-event': 'off',
		// Pragmatic drag and drop has it's own 'userEvent' that is clashing
		// with this rule
		'testing-library/await-async-events': 'off',
	},
};
