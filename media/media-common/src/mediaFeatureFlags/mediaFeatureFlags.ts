import { useRef } from 'react';
import { getLocalMediaFeatureFlag } from '../mediaFeatureFlag-local';
import {
  RequiredMediaFeatureFlags,
  MediaFeatureFlags,
  SupportedProduct,
  supportedProducts,
} from './types';

import { getProductKeys } from './productKeys';

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
    observedWidth: ffA.observedWidth === ffB.observedWidth,
    timestampOnVideo: ffA.timestampOnVideo === ffB.timestampOnVideo,
    memoryCacheLogging: ffA.memoryCacheLogging === ffB.memoryCacheLogging,
    fetchFileStateAfterUpload:
      ffA.fetchFileStateAfterUpload === ffB.fetchFileStateAfterUpload,
  };
  return Object.values(results).every((result) => result);
};

export const filterFeatureFlagNames = (
  flags: RequiredMediaFeatureFlags,
): Array<keyof MediaFeatureFlags> => {
  const pairs = Object.entries(flags) as Array<
    [keyof RequiredMediaFeatureFlags, boolean]
  >;
  return pairs.filter(([_key, value]) => !!value).map(([key]) => key);
};

/**
 * Takes a record of {Media Feature Flag Names → boolean} and a supported product name.
 * Returns the corresponding product’s Launch Darkly Keys for each of the flags set as true in the input record.
 * */
export const mapAndFilterFeatureFlagNames = (
  flags: RequiredMediaFeatureFlags,
  product: SupportedProduct,
): Array<string> => {
  const mediaFeatureFlags = filterFeatureFlagNames(flags);
  return mediaFeatureFlags.map((key) => getProductKeys()[product][key]);
};

// TODO(MEX-1547): This is temporary solution to just return the launch darkly feature flags for all products.
/**
 * Takes a record of {Media Feature Flag Names → boolean}.
 * Returns the Launch Darkly Keys from all products for each of the flags set as true in the input record.
 * */
export const filterFeatureFlagKeysAllProducts = (
  flags: RequiredMediaFeatureFlags,
): Array<string> => {
  const filteredFlags = filterFeatureFlagNames(flags);
  const ldFeatureFlags: Array<string> = [];
  filteredFlags.forEach((flag) =>
    supportedProducts.forEach((product) =>
      ldFeatureFlags.push(getProductKeys()[product][flag]),
    ),
  );
  return ldFeatureFlags.filter((flag) => flag !== '');
};

/**
 * defaultMediaFeatureFlags set default values used by the getter function getMediaFeatureFlag
 *
 * *************************************
 * ************* IMPORTANT *************
 * *************************************
 * Only in exceptional cases a FF should be 'true' by default.
 * Making a flag default to 'true' can lead to confusing and unexpected scenarios.
 * If you must set a flag default = true, whenever you remove that flag
 * that change should be released as a MAJOR, because it's a breaking change.
 */
export const defaultMediaFeatureFlags: Required<MediaFeatureFlags> = {
  newCardExperience: false,
  captions: false,
  mediaInline: false,
  // We can't yet switch this feature on
  // TODO https://product-fabric.atlassian.net/browse/MEX-104
  folderUploads: false,
  observedWidth: false,
  timestampOnVideo: false,
  memoryCacheLogging: false,
  fetchFileStateAfterUpload: false,
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
    return (flagName in featureFlags
      ? featureFlags[flagName]
      : defaultMediaFeatureFlags[flagName]) as unknown as T;
  }
  return defaultMediaFeatureFlags[flagName] as unknown as T;
}

export const useMemoizeFeatureFlags = (featureFlags?: MediaFeatureFlags) => {
  const ref = useRef<MediaFeatureFlags>();
  if (!areEqualFeatureFlags(featureFlags, ref.current)) {
    ref.current = featureFlags;
  }
  return ref.current;
};
