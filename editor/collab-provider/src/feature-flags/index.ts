import type {
  NCSFeatureFlags,
  ProductKeys,
  RequiredNCSFeatureFlags,
  SupportedProduct,
} from './types';

const defaultNCSFeatureFlags: Required<NCSFeatureFlags> = {
  testFF: false,
  blockViewOnly: false,
};

/**
 * Note that Confluence should have the same FF sets as NCS
 */
const productKeys: ProductKeys = {
  confluence: {
    testFF: 'confluence.frontend.collab.provider.testFF',
    blockViewOnly: 'confluence.frontend.ncs.block-view-only',
  },
};

const filterFeatureFlagNames = (
  flags: RequiredNCSFeatureFlags,
): Array<keyof NCSFeatureFlags> => {
  const pairs = Object.entries(flags) as Array<
    [keyof RequiredNCSFeatureFlags, boolean]
  >;
  return pairs.filter(([_key, value]) => !!value).map(([key]) => key);
};

/**
 * Takes a record of {NCS Feature Flag Names → boolean} and a supported product name.
 * Returns the corresponding product’s Launch Darkly Keys for each of the flags set as true in the input record.
 * */
export const getProductSpecificFeatureFlags = (
  flags: RequiredNCSFeatureFlags,
  product: SupportedProduct,
): Array<string> => {
  const ncsFeatureFlags = filterFeatureFlagNames(flags);
  return ncsFeatureFlags.map((key) => productKeys[product][key]);
};

export function getCollabProviderFeatureFlag<T = boolean>(
  flagName: keyof NCSFeatureFlags,
  featureFlags?: { [key: string]: boolean },
): T {
  if (featureFlags) {
    return (flagName in featureFlags
      ? featureFlags[flagName]
      : defaultNCSFeatureFlags[flagName]) as unknown as T;
  }
  return defaultNCSFeatureFlags[flagName] as unknown as T;
}
