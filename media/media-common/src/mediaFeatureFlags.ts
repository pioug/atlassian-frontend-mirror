import { getLocalMediaFeatureFlag } from './mediaFeatureFlag-local';

// Media feature flags - type and defaults defined here in one source of truth
export interface MediaFeatureFlags {
  newCardExperience?: boolean;
  zipPreviews?: boolean;
  captions?: boolean;
  folderUploads?: boolean;
  codeViewer?: boolean;
}

export interface WithMediaFeatureFlags {
  featureFlags?: MediaFeatureFlags;
}

// default values defined here, not necessary for components to know directly as they should use the function below
export const defaultMediaFeatureFlags: Required<MediaFeatureFlags> = {
  newCardExperience: false,
  zipPreviews: false,
  captions: false,
  folderUploads: false,
  codeViewer: false,
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
export function getMediaFeatureFlag<T = boolean>(
  flagName: keyof MediaFeatureFlags,
  featureFlags?: MediaFeatureFlags,
): T {
  const devOverride = getLocalMediaFeatureFlag(flagName);
  if (devOverride !== null) {
    try {
      return JSON.parse(devOverride) as T;
    } catch (e) {}
  }
  if (featureFlags) {
    return ((flagName in featureFlags
      ? featureFlags[flagName]
      : defaultMediaFeatureFlags[flagName]) as unknown) as T;
  }
  return (defaultMediaFeatureFlags[flagName] as unknown) as T;
}

/**
 * do a check for any localStorage overrides, warn user once only
 */
Object.keys(defaultMediaFeatureFlags).forEach((flagName) => {
  const localOverride = getLocalMediaFeatureFlag(flagName);
  if (localOverride !== null) {
    // eslint-disable-next-line no-console
    console.info(
      `%c* LOCAL * MediaFeatureFlag.${flagName} = ${localOverride}`,
      'font-weight:bold;color:cyan',
    );
  }
});
