// eslint-disable-next-line import/no-extraneous-dependencies
import type { Linter } from 'eslint';
import ensureFeatureFlagRegistration from './rules/ensure-feature-flag-registration';
import noPreAndPostInstallScripts from './rules/no-pre-post-installs';
import ensureTestRunnerArguments from './rules/ensure-test-runner-arguments';
import ensureTestRunnerNestedCount from './rules/ensure-test-runner-nested-count';
import ensureAtlassianTeam from './rules/ensure-atlassian-team';
import noDuplicateDependencies from './rules/no-duplicate-dependencies';
import noInvalidFeatureFlagUsage from './rules/no-invalid-feature-flag-usage';
import ensureFeatureFlagPrefix from './rules/ensure-feature-flag-prefix';
import ensureCriticalDependencyResolutions from './rules/ensure-critical-dependency-resolutions';
import ensureValidPlatformYarnProtocolUsage from './rules/ensure-valid-platform-yarn-protocol-usage';
import ensureValidBinValues from './rules/ensure-valid-bin-values';
import noInvalidStorybookDecoratorUsage from './rules/no-invalid-storybook-decorator-usage';
import ensurePublishValid from './rules/ensure-publish-valid';
import ensureNativeAndAfExportsSynced from './rules/ensure-native-and-af-exports-synced';
import noModuleLevelEval from './rules/feature-gating/no-module-level-eval';
import noModuleLevelEvalNav4 from './rules/feature-gating/no-module-level-eval-nav4';
import staticFeatureFlags from './rules/feature-gating/static-feature-flags';
import noPreconditioning from './rules/feature-gating/no-preconditioning';
import inlineUsage from './rules/feature-gating/inline-usage';
import preferFG from './rules/feature-gating/prefer-fg';
import noAlias from './rules/feature-gating/no-alias';
import useEntrypointsInExamples from './rules/use-entrypoints-in-examples';
import useRecommendedUtils from './rules/feature-gating/use-recommended-utils';

export const rules = {
	'ensure-feature-flag-registration': ensureFeatureFlagRegistration,
	'ensure-feature-flag-prefix': ensureFeatureFlagPrefix,
	'ensure-test-runner-arguments': ensureTestRunnerArguments,
	'ensure-test-runner-nested-count': ensureTestRunnerNestedCount,
	'ensure-atlassian-team': ensureAtlassianTeam,
	'ensure-critical-dependency-resolutions': ensureCriticalDependencyResolutions,
	'ensure-valid-platform-yarn-protocol-usage': ensureValidPlatformYarnProtocolUsage,
	'ensure-valid-bin-values': ensureValidBinValues,
	'no-duplicate-dependencies': noDuplicateDependencies,
	'no-invalid-feature-flag-usage': noInvalidFeatureFlagUsage,
	'no-pre-post-install-scripts': noPreAndPostInstallScripts,
	'no-invalid-storybook-decorator-usage': noInvalidStorybookDecoratorUsage,
	'ensure-publish-valid': ensurePublishValid,
	'ensure-native-and-af-exports-synced': ensureNativeAndAfExportsSynced,
	'no-module-level-eval': noModuleLevelEval,
	'no-module-level-eval-nav4': noModuleLevelEvalNav4,
	'static-feature-flags': staticFeatureFlags,
	'no-preconditioning': noPreconditioning,
	'inline-usage': inlineUsage,
	'prefer-fg': preferFG,
	'no-alias': noAlias,
	'use-entrypoints-in-examples': useEntrypointsInExamples,
	'use-recommended-utils': useRecommendedUtils,
};

const commonConfig = {
	'@atlaskit/platform/ensure-test-runner-arguments': 'error',
	'@atlaskit/platform/ensure-test-runner-nested-count': 'warn',
	'@atlaskit/platform/no-invalid-feature-flag-usage': 'error',
	'@atlaskit/platform/no-invalid-storybook-decorator-usage': 'error',
	'@atlaskit/platform/ensure-atlassian-team': 'error',
	'@atlaskit/platform/no-module-level-eval-nav4': 'error',
	// Compiled: rules that are not included via `@compiled/recommended
	'@compiled/jsx-pragma': [
		'error',
		{
			importSources: ['@atlaskit/css'],
			onlyRunIfImportingCompiled: true,
			runtime: 'classic',
		},
	],
};

export const configs = {
	recommended: {
		plugins: ['@atlaskit/platform', '@compiled'],
		rules: {
			...commonConfig,
			'@atlaskit/platform/ensure-feature-flag-registration': 'error',
			'@atlaskit/platform/ensure-feature-flag-prefix': [
				'warn',
				{ allowedPrefixes: ['platform.', 'platform_'] },
			],
			'@atlaskit/platform/no-module-level-eval': 'error',
			'@atlaskit/platform/static-feature-flags': 'error',
			'@atlaskit/platform/no-preconditioning': 'error',
			'@atlaskit/platform/inline-usage': 'error',
			'@atlaskit/platform/prefer-fg': 'error',
			'@atlaskit/platform/no-alias': 'error',
		},
	},
	jira: {
		plugins: ['@atlaskit/platform', '@compiled'],
		rules: {
			...commonConfig,
		},
	},
};

const jsonPrefix =
	'/* eslint-disable quote-props, comma-dangle, quotes, semi, eol-last, @typescript-eslint/semi, no-template-curly-in-string */ module.exports = ';

const jsonPrefixForFlatConfig =
	'/* eslint-disable quote-props, comma-dangle, quotes, semi, eol-last, no-template-curly-in-string */ module.exports = ';

export const processors = {
	'package-json-processor': {
		preprocess: (source: string) => {
			// augment the json into a js file
			return [jsonPrefix + source.trim()];
		},
		postprocess: (messages) => {
			return messages[0].map((message) => {
				const { fix } = message;
				if (!fix) {
					return message;
				}

				const offset = jsonPrefix.length;
				return {
					...message,
					fix: {
						...fix,
						range: [fix.range[0] - offset, fix.range[1] - offset],
					},
				};
			});
		},
		supportsAutofix: true,
	} as Linter.Processor,
	// This processor is used for ESLint FlatConfig,
	// once we roll out FlatConfig, we can remove the above processor
	'package-json-processor-for-flat-config': {
		preprocess: (source: string) => {
			// augment the json into a js file
			return [jsonPrefixForFlatConfig + source.trim()];
		},
		postprocess: (messages) => {
			return messages[0].map((message) => {
				const { fix } = message;
				if (!fix) {
					return message;
				}

				const offset = jsonPrefixForFlatConfig.length;
				return {
					...message,
					fix: {
						...fix,
						range: [fix.range[0] - offset, fix.range[1] - offset],
					},
				};
			});
		},
		supportsAutofix: true,
	} as Linter.Processor,
};
