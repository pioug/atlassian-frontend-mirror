import FeatureGates from '@atlaskit/feature-gate-js-client';

import { debug } from './debug';

const pkgName = '@atlaskit/platform-feature-flags';

export const PFF_GLOBAL_KEY = '__PLATFORM_FEATURE_FLAGS__' as const;

const hasProcessEnv = typeof process !== 'undefined' && typeof process.env !== 'undefined';

// FF global overrides can be configured by test runners or Storybook
const ENV_ENABLE_PLATFORM_FF = hasProcessEnv
	? // Use global "process" variable and process.env['FLAG_NAME'] syntax, so it can be replaced by webpack DefinePlugin
		process.env['ENABLE_PLATFORM_FF'] === 'true'
	: false;

// STORYBOOK_ENABLE_PLATFORM_FF is included as storybook only allows env vars prefixed with STORYBOOK
// https://github.com/storybookjs/storybook/issues/12270

const ENV_STORYBOOK_ENABLE_PLATFORM_FF = hasProcessEnv
	? // Use global "process" variable and process.env['FLAG_NAME'] syntax, so it can be replaced by webpack DefinePlugin
		process.env['STORYBOOK_ENABLE_PLATFORM_FF'] === 'true'
	: false;

const ENABLE_GLOBAL_PLATFORM_FF_OVERRIDE =
	ENV_ENABLE_PLATFORM_FF || ENV_STORYBOOK_ENABLE_PLATFORM_FF;

export type FeatureFlagResolverBoolean = (key: string) => boolean;

type WindowFeatureFlagVars = {
	[PFF_GLOBAL_KEY]: {
		booleanResolver?: FeatureFlagResolverBoolean;
	};
};

const DEFAULT_PFF_GLOBAL: WindowFeatureFlagVars[typeof PFF_GLOBAL_KEY] = {
	booleanResolver: undefined,
};

const globalVar = (typeof window !== 'undefined'
	? window
	: globalThis) as unknown as WindowFeatureFlagVars;

globalVar[PFF_GLOBAL_KEY] = globalVar[PFF_GLOBAL_KEY] || DEFAULT_PFF_GLOBAL;

export function setBooleanResolver(resolver: FeatureFlagResolverBoolean) {
	globalVar[PFF_GLOBAL_KEY].booleanResolver = resolver;
}

export function resolveBooleanFlag(flagKey: string): boolean {
	if (ENABLE_GLOBAL_PLATFORM_FF_OVERRIDE) {
		debug(
			'[%s]: The feature flags were enabled while running tests. The flag "%s" will be always enabled.',
			pkgName,
			flagKey,
		);

		return true;
	}

	try {
		// booleanResolver will be empty for products like Trello, Elevate, Recruit etc.
		// Currently only Confluence, Jira and Bitbucket has set it.
		if (
			globalVar[PFF_GLOBAL_KEY]?.booleanResolver === undefined ||
			globalVar[PFF_GLOBAL_KEY]?.booleanResolver === null
		) {
			// eslint-disable-next-line @atlaskit/platform/use-recommended-utils
			return FeatureGates.checkGate(flagKey);
		}
		const result = globalVar[PFF_GLOBAL_KEY]?.booleanResolver(flagKey);

		if (typeof result !== 'boolean') {
			// eslint-disable-next-line no-console
			console.warn(`${flagKey} resolved to a non-boolean value, returning false for safety`);

			return false;
		}

		return result;
	} catch (e) {
		return false;
	}
}
