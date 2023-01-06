import { debug } from './debug';

type FeatureFlagRegistry = Record<string, boolean>;

declare global {
  var __AF_PLATFORM_FLAGS: undefined | FeatureFlagRegistry;
}

const pkgName = '@atlaskit/platform-feature-flags';

const registry: FeatureFlagRegistry = {};

// FF global overrides can be configured by test runners or Storybook
const ENV_ENABLE_PLATFORM_FF =
  // Use global "process" variable and process.env['FLAG_NAME'] syntax, so it can be replaced by webpack DefinePlugin
  typeof process !== 'undefined'
    ? process.env['ENABLE_PLATFORM_FF'] === 'true'
    : false;

// STORYBOOK_ENABLE_PLATFORM_FF is included as storybook only allows env vars prefixed with STORYBOOK
// https://github.com/storybookjs/storybook/issues/12270

const ENV_STORYBOOK_ENABLE_PLATFORM_FF =
  // Use global "process" variable and process.env['FLAG_NAME'] syntax, so it can be replaced by webpack DefinePlugin
  typeof process !== 'undefined'
    ? process.env['STORYBOOK_ENABLE_PLATFORM_FF'] === 'true'
    : false;

const ENABLE_GLOBAL_PLATFORM_FF_OVERRIDE =
  ENV_ENABLE_PLATFORM_FF || ENV_STORYBOOK_ENABLE_PLATFORM_FF;

// A list of property keys that are not allowed to exist on the store proxy object.
const IN_TESTS_UNDEFINED_KEYS = [
  // Ensures we don't blow up jest when running tests. Jest is trying to be “smart” about what global variables it should clean when those are mocked.
  // https://github.com/facebook/jest/blob/41bf2300895a2c00d0525d21260f0a392819871f/packages/jest-runtime/src/index.ts#L1180
  '_isMockFunction',
];

const store = new Proxy(registry, {
  set(target, key, value) {
    if (typeof key !== 'string' || typeof value !== 'boolean') {
      debug(
        '[%s]: Cannot set the feature flag "%s" to "%s". The registry only accepts string keys and boolean values.',
        pkgName,
        key,
        value,
      );

      return true;
    }

    // Forbid overriding pre-defined flags
    if (target[key] === false) {
      debug(
        '[%s]: The feature flag "%s" was already disabled. The overrides are not allowed',
        pkgName,
        key,
        value,
      );

      return true;
    }

    // Set the flag
    target[key] = value;

    debug('[%s]: Feature flag "%s" was set to "%s"', pkgName, key, value);

    return true;
  },

  get(target, key: string): boolean | undefined {
    if (ENABLE_GLOBAL_PLATFORM_FF_OVERRIDE) {
      debug(
        '[%s]: The feature flags were enabled while running tests. The flag "%s" will be always enabled.',
        pkgName,
        key,
      );

      if (IN_TESTS_UNDEFINED_KEYS.includes(key)) {
        return undefined;
      }

      return true;
    }

    return target[key];
  },
});

const prevState = globalThis.__AF_PLATFORM_FLAGS;
globalThis.__AF_PLATFORM_FLAGS = store;

if (prevState) {
  Object.assign(store, prevState);
}

export { store };
