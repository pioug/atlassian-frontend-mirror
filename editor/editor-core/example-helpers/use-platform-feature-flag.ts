import { useLayoutEffect, useState } from 'react';
import { setBooleanFeatureFlagResolver } from '@atlaskit/platform-feature-flags';

type FeatureFlagMap = Record<string, boolean>;

const usePlatformFeatureFlag = (flags: FeatureFlagMap) => {
  const [isReady, setIsReady] = useState(false);
  useLayoutEffect(() => {
    const booleanFlagResolver = (flagToResolve: string): boolean =>
      flags[flagToResolve] ?? false;
    setBooleanFeatureFlagResolver(booleanFlagResolver);
    setIsReady(true);
  }, [flags]);

  return isReady;
};

export default usePlatformFeatureFlag;
