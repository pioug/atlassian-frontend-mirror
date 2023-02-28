import ensureFeatureFlagRegistration from './rules/ensure-feature-flag-registration';

export const rules = {
  'ensure-feature-flag-registration': ensureFeatureFlagRegistration,
};

export const configs = {
  recommended: {
    plugins: ['@atlaskit/platform'],
    rules: {
      '@atlaskit/platform/ensure-feature-flag-registration': 'error',
    },
  },
};
