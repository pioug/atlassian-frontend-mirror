import camelCase from 'lodash/camelCase';
import kebabCase from 'lodash/kebabCase';

import type { FeatureFlagKey, FeatureFlags } from './types/feature-flags';

type BooleanFlags = Record<string, boolean>;

type NormalizedFeatureFlags<ObjectFlags> = Partial<ObjectFlags & BooleanFlags>;

const EMPTY = {};

function isObjectFlagKey(
	key: string,
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	value: any,
	objectFlagKeys: string[] | undefined,
): value is string {
	return Boolean(typeof value === 'string' && objectFlagKeys?.includes(key));
}

function isValidJSONObject(value: string) {
	try {
		let result = JSON.parse(value);
		if (typeof result === 'object' && result !== null) {
			return true;
		}
		return false;
	} catch (err) {
		return false;
	}
}

/**
 * Normalise and filter a free Record<string, unknown> to match
 * the rules for feature flags in editor and renderer
 *
 * Input has to match to not be filtered output:
 * 1. cased in kebab-case (match [a-z-])
 * 2. has any value
 *
 * Output matches
 * 1. cased in camelCase (match [a-zA-Z])
 * 2. has boolean value or object {} value
 *
 * @param rawFeatureFlags
 */
export function normalizeFeatureFlags<ObjectFlags>(
	rawFeatureFlags?: Record<string, unknown>,
	options?: {
		objectFlagKeys: string[];
	},
): NormalizedFeatureFlags<ObjectFlags> {
	if (!rawFeatureFlags) {
		return EMPTY;
	}

	return Object.entries(rawFeatureFlags)
		.filter((e): e is [string, boolean | string] => {
			if (typeof e[1] === 'boolean') {
				return true;
			}
			if (
				isObjectFlagKey(camelCase(e[0]), e[1], options?.objectFlagKeys) &&
				isValidJSONObject(e[1])
			) {
				return true;
			}
			return false;
		})
		.filter(([key]) => kebabCase(key) === key)
		.map<[string, boolean | string]>(([key, value]) => [camelCase(key), value])
		.reduce<NormalizedFeatureFlags<ObjectFlags>>((flags, [key, value]) => {
			if (isObjectFlagKey(key, value, options?.objectFlagKeys)) {
				flags[key as keyof ObjectFlags] = JSON.parse(value);
			}
			if (typeof value === 'boolean') {
				(flags as Record<string, boolean>)[key] = value;
			}
			return flags;
		}, {});
}

/**
 * Transforms FeatureFlags to a type safe string array of the enabled feature flags.
 *
 * Useful for analytics and analysis purposes.
 */
export function getEnabledFeatureFlagKeys(featureFlags: FeatureFlags) {
	return (Object.keys(featureFlags) as FeatureFlagKey[]).filter(
		(key) => featureFlags[key] === true,
	);
}
