import { getLocalMediaFeatureFlag } from './mediaFeatureFlag-local';

// Media feature flags - type and defaults defined here in one source of truth
export interface MediaFeatureFlags {
  newCardExperience?: boolean;
  zipPreviews?: boolean;
  captions?: boolean;
}

// default values defined here, not necessary for components to know directly as they should use the function below
export const defaultMediaFeatureFlags: MediaFeatureFlags = {
  newCardExperience: false,
  zipPreviews: false,
  captions: false,
};

/**
 * Public accessor from components to fallback to defaults if flags not passed,
 * otherwise whatever product has set will be returned.
 *
 * To override locally for testing:
 * - `localStorage[flagName] = true` to enable locally,
 * - `delete localStorage[flagName]` to remove.
 *
 * (you will see a warning in console if override used)
 * */
export const getMediaFeatureFlag = (
  flagName: keyof MediaFeatureFlags,
  featureFlags?: MediaFeatureFlags,
) => {
  const devOverride = getLocalMediaFeatureFlag(flagName);
  if (devOverride !== null) {
    return devOverride === 'true';
  }
  if (featureFlags) {
    return flagName in featureFlags
      ? featureFlags[flagName]
      : defaultMediaFeatureFlags[flagName];
  }
  return defaultMediaFeatureFlags[flagName];
};

/**
 * do a check for any localStorage overrides, warn user once only
 */
Object.keys(defaultMediaFeatureFlags).forEach(flagName => {
  const localOverride = getLocalMediaFeatureFlag(flagName);
  if (localOverride !== null) {
    // eslint-disable-next-line no-console
    console.info(
      `%cMediaFeatureFlag.${flagName} = ${localOverride}`,
      'font-weight:bold;color:cyan',
    );
  }
});
