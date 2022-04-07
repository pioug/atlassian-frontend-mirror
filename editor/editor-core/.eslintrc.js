module.exports = {
  overrides: [
    {
      // Temporary override to apply tokens lint rules to a subset of editor packages
      // TODO remove in https://product-fabric.atlassian.net/browse/DSP-4001
      files: ['./src/ADD_PATH_HERE/**/*'],
      rules: {
        '@atlaskit/design-system/ensure-design-token-usage': [
          'error',
          { shouldEnforceFallbacks: true },
        ],
        '@atlaskit/design-system/no-unsafe-design-token-usage': [
          'error',
          { shouldEnforceFallbacks: true },
        ],
        '@atlaskit/design-system/no-deprecated-design-token-usage': ['warn'],
      },
    },
  ],
};
