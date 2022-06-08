module.exports = {
  overrides: [
    {
      // Lint documentation to ensure usage examples are up-to-date
      files: ['./examples/**', './docs/**'],
      rules: {
        '@atlaskit/design-system/no-deprecated-design-token-usage': ['warn'],
        '@atlaskit/design-system/ensure-design-token-usage': [
          'error',
          { shouldEnforceFallbacks: true },
        ],
      },
    },
    {
      // Constellation examples, and docs, include fallbacks for now
      files: ['./examples/constellation/**', './docs/**'],
      rules: {
        '@atlaskit/design-system/no-unsafe-design-token-usage': [
          'error',
          { shouldEnforceFallbacks: true },
        ],
      },
    },
    {
      // Atlaskit examples don't all have fallbacks
      files: ['./examples/**.tsx'],
      rules: {
        '@atlaskit/design-system/no-unsafe-design-token-usage': [
          'error',
          { shouldEnforceFallbacks: false },
        ],
      },
    },
  ],
};
