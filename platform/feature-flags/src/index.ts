import {
  setBooleanResolver,
  resolveBooleanFlag,
  FeatureFlagResolverBoolean,
} from './resolvers';

/**
 * This creates a boolean flag resolver that allows calls to `getBooleanFF` inside of Platform components to use a Product's
 * feature flag client and LD project, rather than installing a feature flag client of their own, or passing those flags in via props.
 *
 * @param flagResolver
 */
export function setBooleanFeatureFlagResolver(
  flagResolver: FeatureFlagResolverBoolean,
): void {
  setBooleanResolver(flagResolver);
}

/**
 * Returns the value of a feature flag. If the flag does not resolve, it returns the "false" as a default value.
 *
 * @param name
 */
export function getBooleanFF(name: string): boolean {
  return resolveBooleanFlag(name);
}
