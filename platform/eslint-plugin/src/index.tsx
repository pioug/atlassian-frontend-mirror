import type { Linter } from 'eslint';
import ensureFeatureFlagRegistration from './rules/ensure-feature-flag-registration';
import noPreAndPostInstallScripts from './rules/no-pre-post-installs';
import ensureTestRunnerArguments from './rules/ensure-test-runner-arguments';
import ensureTestRunnerNestedCount from './rules/ensure-test-runner-nested-count';
import ensureAtlassianTeam from './rules/ensure-atlassian-team';
import noInvalidFeatureFlagUsage from './rules/no-invalid-feature-flag-usage';
import ensureFeatureFlagPrefix from './rules/ensure-feature-flag-prefix';
import ensureCriticalDependencyResolutions from './rules/ensure-critical-dependency-resolutions';
import noInvalidStorybookDecoratorUsage from './rules/no-invalid-storybook-decorator-usage';
import ensurePublishValid from './rules/ensure-publish-valid';

export const rules = {
  'ensure-feature-flag-registration': ensureFeatureFlagRegistration,
  'ensure-feature-flag-prefix': ensureFeatureFlagPrefix,
  'ensure-test-runner-arguments': ensureTestRunnerArguments,
  'ensure-test-runner-nested-count': ensureTestRunnerNestedCount,
  'ensure-atlassian-team': ensureAtlassianTeam,
  'ensure-critical-dependency-resolutions': ensureCriticalDependencyResolutions,
  'no-invalid-feature-flag-usage': noInvalidFeatureFlagUsage,
  'no-pre-post-install-scripts': noPreAndPostInstallScripts,
  'no-invalid-storybook-decorator-usage': noInvalidStorybookDecoratorUsage,
  'ensure-publish-valid': ensurePublishValid,
};

export const configs = {
  recommended: {
    plugins: ['@atlaskit/platform'],
    rules: {
      '@atlaskit/platform/ensure-feature-flag-registration': 'error',
      '@atlaskit/platform/ensure-feature-flag-prefix': [
        'error',
        { allowedPrefixes: ['platform.'] },
      ],
      '@atlaskit/platform/ensure-test-runner-arguments': 'error',
      '@atlaskit/platform/ensure-test-runner-nested-count': 'warn',
      '@atlaskit/platform/no-invalid-feature-flag-usage': 'error',
      '@atlaskit/platform/no-invalid-storybook-decorator-usage': 'error',
      '@atlaskit/platform/ensure-atlassian-team': 'error',
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
