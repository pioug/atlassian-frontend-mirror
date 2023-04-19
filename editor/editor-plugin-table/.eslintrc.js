module.exports = {
  rules: {
    // Ensure the table plugin is not coupled to editor-core and avoid circular dependencies
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['@atlaskit/editor-core/*', '@atlaskit/editor-core'],
            message:
              'Importing editor-core is not allowed in editor-plugin-table. Consider using editor-common instead.',
          },
        ],
      },
    ],
    'react/no-danger': 'error',
  },
  // Disable restricted import for tests
  overrides: [
    {
      files: ['**/__tests__/**/*.{js,ts,tsx}', 'examples/**/*.{js,ts,tsx}'],
      rules: {
        'no-restricted-imports': [
          'off',
          {
            patterns: [
              {
                group: ['@atlaskit/editor-core/*', '@atlaskit/editor-core'],
              },
            ],
          },
        ],
        'react/no-danger': 'off',
      },
    },
  ],
};
