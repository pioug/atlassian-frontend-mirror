import { debug } from './debug';

type FeatureFlagRegistry = Record<string, boolean>;

declare global {
  var __AF_PLATFORM_FLAGS: undefined | FeatureFlagRegistry;
}

const pkgName = '@atlaskit/platform-feature-flags';

const registry: FeatureFlagRegistry = {};

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
});

const prevState = globalThis.__AF_PLATFORM_FLAGS;
globalThis.__AF_PLATFORM_FLAGS = store;

if (prevState) {
  Object.assign(store, prevState);
}

export { store };
