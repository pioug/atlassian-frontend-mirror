import { useRef } from 'react';
import { getLocalMediaFeatureFlag } from './mediaFeatureFlag-local';

// Media feature flags - type and defaults defined here in one source of truth
export interface MediaFeatureFlags {
  newCardExperience?: boolean;
  captions?: boolean;
  mediaInline?: boolean;
  // We can't yet switch this feature on
  // https://product-fabric.atlassian.net/browse/MEX-104
  folderUploads?: boolean;
  timestampOnVideo?: boolean;
  observedWidth?: boolean;
}

export interface WithMediaFeatureFlags {
  featureFlags?: MediaFeatureFlags;
}

// default values defined here, not necessary for components to know directly as they should use the function below
export const defaultMediaFeatureFlags: Required<MediaFeatureFlags> = {
  newCardExperience: false,
  captions: false,
  mediaInline: false,
  // We can't yet switch this feature on
  // TODO https://product-fabric.atlassian.net/browse/MEX-104
  folderUploads: false,
  timestampOnVideo: false,
  observedWidth: false,
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

// With this type we ensure the object will contain all the flags
export type RequiredMediaFeatureFlags = Record<
  keyof Required<MediaFeatureFlags>,
  boolean
>;

export const areEqualFeatureFlags = (
  ffA?: MediaFeatureFlags,
  ffB?: MediaFeatureFlags,
): boolean => {
  if (!ffA && !ffB) {
    return true;
  }
  if (!ffA || !ffB) {
    return false;
  }

  const results: RequiredMediaFeatureFlags = {
    newCardExperience: ffA.newCardExperience === ffB.newCardExperience,
    captions: ffA.captions === ffB.captions,
    mediaInline: ffA.mediaInline === ffB.mediaInline,
    folderUploads: ffA.folderUploads === ffB.folderUploads,
    timestampOnVideo: ffA.timestampOnVideo === ffB.timestampOnVideo,
    observedWidth: ffA.observedWidth === ffB.observedWidth,
  };
  return Object.values(results).every((result) => result);
};

export const useMemoizeFeatureFlags = (featureFlags?: MediaFeatureFlags) => {
  const ref = useRef<MediaFeatureFlags>();
  if (!areEqualFeatureFlags(featureFlags, ref.current)) {
    ref.current = featureFlags;
  }
  return ref.current;
};

export const filterFeatureFlagNames = (
  flags: RequiredMediaFeatureFlags,
): Array<keyof MediaFeatureFlags> => {
  const pairs = Object.entries(flags) as Array<
    [keyof RequiredMediaFeatureFlags, boolean]
  >;
  return pairs.filter(([_key, value]) => !!value).map(([key]) => key);
};
