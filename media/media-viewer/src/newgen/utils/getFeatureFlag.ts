import { MediaViewerFeatureFlags } from '../domain';

export const featureFlagsMap: { [key: string]: string } = {};

export const getFeatureFlag = (
  featureName: keyof MediaViewerFeatureFlags,
  featureFlags?: MediaViewerFeatureFlags,
): boolean => {
  if (window.localStorage) {
    const devOverride = window.localStorage.getItem(
      featureFlagsMap[featureName],
    );

    if (devOverride !== null) {
      // localStorage stores strings only.
      // Every string except 'false' will enable the flag.
      return devOverride !== 'false';
    }
  }

  return Boolean(featureFlags && featureFlags[featureName]);
};
