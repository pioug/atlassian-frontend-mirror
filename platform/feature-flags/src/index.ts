import { store } from './registry';

/**
 * Sets a feature flag to a given value.
 *
 * @param name
 * @param value
 */
export function setBooleanFF(name: string, value: boolean): void {
  store[name] = value;
}

/**
 * Returns the value of a feature flag. If the flag is not set, returns the "false" as a default value.
 * @param name
 */
export function getBooleanFF(name: string): boolean {
  const defaultValue = false;

  return store?.[name] ?? defaultValue;
}
