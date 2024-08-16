module.exports = {
	rules: {
		'@typescript-eslint/no-unused-vars': [
			'error',
			{
				args: 'none',
				vars: 'local',
				varsIgnorePattern: '^_',
				ignoreRestSiblings: true,
			},
		],
		'no-unused-vars': 'off',
	},
};
