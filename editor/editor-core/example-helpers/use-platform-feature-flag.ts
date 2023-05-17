import { useEffect } from 'react';
import { setBooleanFeatureFlagResolver } from '@atlaskit/platform-feature-flags';

type FeatureFlagMap = Record<string, boolean>;

const usePlatformFeatureFlag = (flags: FeatureFlagMap) => {
  useEffect(() => {
    const booleanFlagResolver = (flagToResolve: string): boolean =>
      flags[flagToResolve] ?? false;

    setBooleanFeatureFlagResolver(booleanFlagResolver);
  }, [flags]);
};

export default usePlatformFeatureFlag;
