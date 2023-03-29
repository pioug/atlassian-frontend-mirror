import type { Linter } from 'eslint';
import ensureFeatureFlagRegistration from './rules/ensure-feature-flag-registration';
import noPreAndPostInstallScripts from './rules/no-pre-post-installs';
import ensureTestRunnerArguments from './rules/ensure-test-runner-arguments';
import ensureTestRunnerNestedCount from './rules/ensure-test-runner-nested-count';
import noInvalidFeatureFlagUsage from './rules/no-invalid-feature-flag-usage';

export const rules = {
  'ensure-feature-flag-registration': ensureFeatureFlagRegistration,
  'ensure-test-runner-arguments': ensureTestRunnerArguments,
  'ensure-test-runner-nested-count': ensureTestRunnerNestedCount,
  'no-invalid-feature-flag-usage': noInvalidFeatureFlagUsage,
  'no-pre-post-install-scripts': noPreAndPostInstallScripts,
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

export const processors = {
  'package-json-processor': {
    preprocess: (source: string) => {
      // augment the json into a js file
      return [
        `/* eslint-disable quote-props, comma-dangle, quotes, semi, eol-last, @typescript-eslint/semi, no-template-curly-in-string */ module.exports = ${source.trim()}`,
      ];
    },
    postprocess: (errors) => errors[0],
  } as Linter.Processor,
};
