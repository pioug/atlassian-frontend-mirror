import { debug } from './debug';

const pkgName = '@atlaskit/platform-feature-flags';

const hasProcessEnv =
  typeof process !== 'undefined' && typeof process.env !== 'undefined';

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

// In development mode we want to capture any feature flag checks that happen using the default resolver and log this result when the resolver is replaced.
// This is because evaluating feature flags when the resolver/FF client is loaded asynchronously could cause unexpected issues.
const flagsResolvedEarly = new Map<string, number>();

let booleanResolver: FeatureFlagResolverBoolean = (flagKey: string) => {
  if (process.env.NODE_ENV !== 'production') {
    const unresolvedFlagCount = flagsResolvedEarly.get(flagKey) ?? 0;
    flagsResolvedEarly.set(flagKey, unresolvedFlagCount + 1);
  }

  return false;
};

export function setBooleanResolver(resolver: FeatureFlagResolverBoolean) {
  booleanResolver = resolver;

  if (process.env.NODE_ENV !== 'production') {
    if (flagsResolvedEarly.size > 0) {
      debug(
        `[%s]: The following list of Feature Flags were called, the following number of times, before setBooleanResolver.`,
        pkgName,
        Array.from(flagsResolvedEarly.entries()),
      );

      flagsResolvedEarly.clear();
    }
  }
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
    const result = booleanResolver(flagKey);

    if (typeof result !== 'boolean') {
      // eslint-disable-next-line no-console
      console.warn(
        `${flagKey} resolved to a non-boolean value, returning false for safety`,
      );

      return false;
    }

    return result;
  } catch (e) {
    return false;
  }
}
