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

// With this type we ensure the object will contain all the flags
export type RequiredMediaFeatureFlags = Record<
  keyof Required<MediaFeatureFlags>,
  boolean
>;

export type MediaFeatureFlagsMap = Record<
  keyof Required<MediaFeatureFlags>,
  string
>;

export type SupportedProduct = 'confluence' | 'jira';
