/** @jsx jsx */
import { jsx } from '@emotion/react';

import { NavigationSkeleton } from '../../src/skeleton';

const InteractiveSkeletonExample = () => {
  return (
    <NavigationSkeleton
      primaryItemsCount={2}
      secondaryItemsCount={1}
      shouldShowSearch={true}
    />
  );
};

export default InteractiveSkeletonExample;
