import { store } from './registry';
import { BooleanFeatureFlagType } from './types';

/**
 * Sets a feature flag to a given value.
 *
 * @param name
 * @param value
 */
export function setBooleanFF(
  name: BooleanFeatureFlagType,
  value: boolean,
): void {
  store[name] = value;
}

/**
 * Returns the value of a feature flag. If the flag is not set, returns the "false" as a default value.
 * @param name
 */
export function getBooleanFF(name: BooleanFeatureFlagType): boolean {
  const defaultValue = false;

  return store?.[name] ?? defaultValue;
}
