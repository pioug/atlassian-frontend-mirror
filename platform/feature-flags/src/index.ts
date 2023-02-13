import {
  setBooleanResolver,
  resolveBooleanFlag,
  FeatureFlagResolverBoolean,
} from './resolvers';

/**
 * Sets the flag resolver for boolean flags.
 * @param flagResolver
 */
export function setBooleanFeatureFlagResolver(
  flagResolver: FeatureFlagResolverBoolean,
): void {
  setBooleanResolver(flagResolver);
}

/**
 * Returns the value of a feature flag. If the flag does not resolve, it returns the "false" as a default value.
 * @param name
 */
export function getBooleanFF(name: string): boolean {
  return resolveBooleanFlag(name);
}
