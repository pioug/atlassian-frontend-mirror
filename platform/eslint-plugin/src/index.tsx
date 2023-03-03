import ensureFeatureFlagRegistration from './rules/ensure-feature-flag-registration';
import ensureTestRunnerArguments from './rules/ensure-test-runner-arguments';
import ensureTestRunnerNestedCount from './rules/ensure-test-runner-nested-count';
import noInvalidFeatureFlagUsage from './rules/no-invalid-feature-flag-usage';

export const rules = {
  'ensure-feature-flag-registration': ensureFeatureFlagRegistration,
  'ensure-test-runner-arguments': ensureTestRunnerArguments,
  'ensure-test-runner-nested-count': ensureTestRunnerNestedCount,
  'no-invalid-feature-flag-usage': noInvalidFeatureFlagUsage,
};

export const configs = {
  recommended: {
    plugins: ['@atlaskit/platform'],
    rules: {
      '@atlaskit/platform/ensure-feature-flag-registration': 'error',
      '@atlaskit/platform/ensure-test-runner-arguments': 'error',
      '@atlaskit/platform/ensure-test-runner-nested-count': 'warn',
      '@atlaskit/platform/no-invalid-feature-flag-usage': 'error',
    },
  },
};
