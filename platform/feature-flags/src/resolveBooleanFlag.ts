import FeatureGates from '@atlaskit/feature-gate-js-client';

import { debug } from './debug';
import { ENV_ENABLE_PLATFORM_FF } from './env-enable-platform-ff';
import { ENV_STORYBOOK_ENABLE_PLATFORM_FF } from './env-storybook-enable-platform-ff';
import { globalVar } from './globalVar';
import { PFF_GLOBAL_KEY, pkgName } from './resolvers';

const ENABLE_GLOBAL_PLATFORM_FF_OVERRIDE =
	ENV_ENABLE_PLATFORM_FF || ENV_STORYBOOK_ENABLE_PLATFORM_FF;

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
