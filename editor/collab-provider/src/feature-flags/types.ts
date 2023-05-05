// NCS feature flags - type and defaults defined here in one source of truth
export interface NCSFeatureFlags {
  testFF?: boolean;
}

export interface WithNCSFeatureFlags {
  featureFlags?: NCSFeatureFlags;
}

// With this type we ensure the object will contain all the flags
export type RequiredNCSFeatureFlags = Record<
  keyof Required<NCSFeatureFlags>,
  boolean
>;

export type NCSFeatureFlagsMap = Record<
  keyof Required<NCSFeatureFlags>,
  string
>;

export const supportedProducts = ['confluence'] as const;
export type SupportedProduct = (typeof supportedProducts)[number];

export type ProductKeys = Record<SupportedProduct, NCSFeatureFlagsMap>;
