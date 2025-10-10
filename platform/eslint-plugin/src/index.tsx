// eslint-disable-next-line import/no-extraneous-dependencies
import compiledPlugin from '@compiled/eslint-plugin';
import type { ESLint, Linter } from 'eslint';
import ensureFeatureFlagRegistration from './rules/ensure-feature-flag-registration';
import noPreAndPostInstallScripts from './rules/no-pre-post-installs';
import ensureTestRunnerArguments from './rules/ensure-test-runner-arguments';
import ensureTestRunnerNestedCount from './rules/ensure-test-runner-nested-count';
import ensureAtlassianTeam from './rules/ensure-atlassian-team';
import noDuplicateDependencies from './rules/no-duplicate-dependencies';
import noInvalidFeatureFlagUsage from './rules/no-invalid-feature-flag-usage';
import ensureCriticalDependencyResolutions from './rules/ensure-critical-dependency-resolutions';
import ensureValidBinValues from './rules/ensure-valid-bin-values';
import ensureNoPrivateDependencies from './rules/ensure-no-private-dependencies';
import expandBorderShorthand from './rules/compiled/expand-border-shorthand';
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
import expandBackgroundShorthand from './rules/compiled/expand-background-shorthand';
import expandSpacingShorthand from './rules/compiled/expand-spacing-shorthand';
import noSparseCheckout from './rules/no-sparse-checkout';
import noDirectDocumentUsage from './rules/no-direct-document-usage';
import noSetImmediate from './rules/no-set-immediate';
import { join, normalize } from 'node:path';
import { readFileSync } from 'node:fs';

let jiraRoot: string | undefined;

try {
	const findUp = require('find-up') as typeof import('find-up');
	findUp.sync((dir) => {
		const productsJsonPath = join(dir, 'products.json');
		if (findUp.sync.exists(productsJsonPath)) {
			const productJson: Record<string, { path: string }> = JSON.parse(
				readFileSync(productsJsonPath, 'utf-8'),
			);
			if (productJson.Jira) {
				jiraRoot = normalize(join(dir, productJson.Jira.path));
				return findUp.stop;
			}
		}
	});
} catch {
	// we aren't running inside of AFM, so we can ignore this.
}

const packageJson: {
	name: string;
	version: string;
	// eslint-disable-next-line import/no-extraneous-dependencies
} = require('@atlaskit/eslint-plugin-platform/package.json');

const rules = {
	'ensure-feature-flag-registration': ensureFeatureFlagRegistration,
	'ensure-test-runner-arguments': ensureTestRunnerArguments,
	'ensure-test-runner-nested-count': ensureTestRunnerNestedCount,
	'ensure-atlassian-team': ensureAtlassianTeam,
	'ensure-critical-dependency-resolutions': ensureCriticalDependencyResolutions,
	'ensure-valid-bin-values': ensureValidBinValues,
	'ensure-no-private-dependencies': ensureNoPrivateDependencies,
	'expand-border-shorthand': expandBorderShorthand,
	'expand-background-shorthand': expandBackgroundShorthand,
	'expand-spacing-shorthand': expandSpacingShorthand,
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
	'no-sparse-checkout': noSparseCheckout,
	'no-direct-document-usage': noDirectDocumentUsage,
	'no-set-immediate': noSetImmediate,
};

const commonConfig = {
	'@atlaskit/platform/ensure-test-runner-arguments': 'error',
	'@atlaskit/platform/ensure-test-runner-nested-count': 'warn',
	'@atlaskit/platform/no-invalid-feature-flag-usage': 'error',
	'@atlaskit/platform/no-invalid-storybook-decorator-usage': 'error',
	'@atlaskit/platform/ensure-atlassian-team': 'error',
	'@atlaskit/platform/no-module-level-eval-nav4': 'error',
	'@atlaskit/platform/no-direct-document-usage': 'warn',
	'@atlaskit/platform/no-set-immediate': 'error',
	// Compiled: rules that are not included via `@compiled/recommended
	'@atlaskit/platform/expand-border-shorthand': 'error',
	'@atlaskit/platform/expand-background-shorthand': 'error',
	'@atlaskit/platform/expand-spacing-shorthand': 'error',
	'@compiled/jsx-pragma': [
		'error',
		{
			importSources: ['@atlaskit/css'],
			onlyRunIfImportingCompiled: true,
			runtime: 'classic',
		},
	],
} satisfies Linter.RulesRecord;

const recommendedRules = {
	...commonConfig,
	// See platform/packages/platform/eslint-plugin/src/rules/feature-gating/README.md
	// These rules are specific to `platform` and seem a WIP; jira and confluence currently have their own rules
	'@atlaskit/platform/no-module-level-eval': 'error',
	'@atlaskit/platform/static-feature-flags': 'error',
	'@atlaskit/platform/no-preconditioning': 'error',
	'@atlaskit/platform/inline-usage': 'error',
	'@atlaskit/platform/prefer-fg': 'error',
	'@atlaskit/platform/no-alias': 'error',
	// end: feature-gating rules
	'@atlaskit/platform/ensure-feature-flag-registration': 'error',
} satisfies Linter.RulesRecord;

const jiraRules = commonConfig;

const jsonPrefix =
	'/* eslint-disable quote-props, comma-dangle, quotes, semi, eol-last, @typescript-eslint/semi, no-template-curly-in-string */ module.exports = ';

const jsonPrefixForFlatConfig =
	'/* eslint-disable quote-props, comma-dangle, quotes, semi, eol-last, no-template-curly-in-string */ module.exports = ';

const jsonPrefixForJira = 'module.exports = ';

const { name, version } = packageJson;
const plugin = {
	meta: {
		name,
		version,
	},
	rules,
	configs: {
		recommended: {
			plugins: ['@atlaskit/platform', '@compiled'],
			rules: recommendedRules,
		},
		'recommended/flat': {
			plugins: {
				get '@atlaskit/platform'(): ESLint.Plugin {
					return plugin;
				},
				// @ts-expect-error there's an issue with the types for @compiled/eslint-plugin ('no-css-prop-without-css-function' specifically)
				'@compiled': { meta: compiledPlugin.meta, rules: compiledPlugin.rules } as ESLint.Plugin,
			},
			rules: recommendedRules,
		},
		jira: {
			plugins: ['@atlaskit/platform', '@compiled'],
			rules: jiraRules,
		},
		'jira/flat': {
			plugins: {
				get '@atlaskit/platform'(): ESLint.Plugin {
					return plugin;
				},
				// @ts-expect-error there's an issue with the types for @compiled/eslint-plugin ('no-css-prop-without-css-function' specifically)
				'@compiled': { meta: compiledPlugin.meta, rules: compiledPlugin.rules } as ESLint.Plugin,
			},
			rules: jiraRules,
		},
	},
	processors: {
		'package-json-processor': {
			preprocess: (source, filename) => {
				// we only need to check for jiraRoot because it uses a different
				// ESLint version and produces fake errors due to how this processor handles JSON
				if (jiraRoot && filename.startsWith(jiraRoot)) {
					// augment the json into a js file
					return [jsonPrefixForJira + source.trim()];
				}

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
			// we only need to check for jiraRoot because it uses a different
			// ESLint version and produces fake errors due to how this processor handles JSON
			preprocess: (source, filename) => {
				if (jiraRoot && filename.startsWith(jiraRoot)) {
					// augment the json into a js file
					return [jsonPrefixForJira + source.trim()];
				}
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
	},
} satisfies ESLint.Plugin;
const configs = plugin.configs;
const processors = plugin.processors;

export { configs, plugin, processors, rules };
export default plugin;
