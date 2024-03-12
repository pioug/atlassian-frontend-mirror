module.exports = {
  rules: {
    '@atlaskit/design-system/consistent-css-prop-usage': 'warn',
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
