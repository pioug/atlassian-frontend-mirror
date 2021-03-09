import camelCase from 'lodash/camelCase';
import kebabCase from 'lodash/kebabCase';

type NormalizedFeatureFlags = Record<string, boolean>;

const EMPTY = {};

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
 * 2. has boolean value
 *
 * @param rawFeatureFlags
 */
export function normalizeFeatureFlags(
  rawFeatureFlags?: Record<string, unknown>,
): NormalizedFeatureFlags {
  if (!rawFeatureFlags) {
    return EMPTY;
  }

  return Object.entries(rawFeatureFlags)
    .filter((e): e is [string, boolean] => typeof e[1] === 'boolean')
    .filter(([key]) => kebabCase(key) === key)
    .map(([key, value]) => [camelCase(key), value] as const)
    .reduce<NormalizedFeatureFlags>((flags, [key, value]) => {
      flags[key] = value;
      return flags;
    }, {});
}
