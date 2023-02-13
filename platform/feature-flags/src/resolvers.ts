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

let booleanResolver: FeatureFlagResolverBoolean = () => false;

export function setBooleanResolver(resolver: FeatureFlagResolverBoolean) {
  booleanResolver = resolver;
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
