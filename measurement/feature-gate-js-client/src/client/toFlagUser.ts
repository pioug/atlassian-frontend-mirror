import type { FlagContextValue, FlagUser } from '@atlaskit/flag-client/types';

import { toStatsigUser } from './toStatsigUser';
import { type CustomAttributes, type Identifiers } from './types';

const isFlagContextValue = (value: unknown): value is FlagContextValue =>
	typeof value === 'string' ||
	typeof value === 'boolean' ||
	(typeof value === 'number' && Number.isFinite(value));

/**
 * Maps the wrapper user onto an FFP user.
 *
 * Identifier keys use the same names as the Statsig custom IDs (for example `stableID`), which is
 * how the Feature Flag Service keys the FFP request context. Attributes the FFP client cannot
 * accept (such as string arrays) are dropped here so that it does not warn on every update.
 */
export const toFlagUser = (
	identifiers: Identifiers,
	customAttributes?: CustomAttributes,
): FlagUser => {
	const flagIdentifiers: Record<string, string> = {};
	Object.entries(toStatsigUser(identifiers).customIDs ?? {}).forEach(([key, value]) => {
		if (typeof value === 'string') {
			flagIdentifiers[key] = value;
		}
	});

	const attributes: Record<string, FlagContextValue> = {};
	Object.entries(customAttributes ?? {}).forEach(([key, value]) => {
		if (isFlagContextValue(value)) {
			attributes[key] = value;
		}
	});

	return { identifiers: flagIdentifiers, attributes };
};
