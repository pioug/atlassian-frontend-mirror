module.exports = {
  rules: {
    // We're using relative imports on test utility packages to avoid circular dependencies
    '@atlassian/tangerine/import/no-relative-package-imports': 'off',
  },
};
