import {
  type RequiredMediaFeatureFlags,
  type MediaFeatureFlags,
  supportedProducts,
} from './types';

import { getProductKeys } from './productKeys';
import { getGenericFeatureFlag } from './genericFeatureFlag';

export const filterFeatureFlagNames = (
  flags: RequiredMediaFeatureFlags,
): Array<keyof MediaFeatureFlags> => {
  const pairs = Object.entries(flags) as Array<
    [keyof RequiredMediaFeatureFlags, boolean]
  >;
  return pairs.filter(([_key, value]) => !!value).map(([key]) => key);
};

// TODO(MEX-1547): This is temporary solution to just return the launch darkly feature flags for all products.
/**
 * Takes a record of {Media Feature Flag Names → boolean}.
 * Returns the Launch Darkly Keys from all products for each of the flags set as true in the input record.
 * */
export const getFeatureFlagKeysAllProducts = (): Array<string> => {
  const productKeys = getProductKeys();
  let ldFeatureFlags: Array<string> = [];
  supportedProducts.forEach((product) => {
    ldFeatureFlags = [
      ...ldFeatureFlags,
      ...Object.values(productKeys[product]),
    ];
  });
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
  mediaInline: false,
  // We can't yet switch this feature on
  // TODO https://product-fabric.atlassian.net/browse/MEX-104
  folderUploads: false,
  commentsOnMedia: false,
  commentsOnMediaIncludePage: false
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
  return getGenericFeatureFlag<
    T,
    keyof MediaFeatureFlags,
    Required<MediaFeatureFlags>
  >(flagName, defaultMediaFeatureFlags, featureFlags);
}
