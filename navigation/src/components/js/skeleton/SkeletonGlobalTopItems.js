import React from 'react';

import { Skeleton as SkeletonIcon } from '@atlaskit/icon';

import SkeletonNavigationItems from './styled/SkeletonNavigationItems';
import SkeletonGlobalPrimaryIconOuter from './styled/SkeletonGlobalPrimaryIconOuter';
import SkeletonGlobalIconOuter from './styled/SkeletonGlobalIconOuter';
import SkeletonGlobalTopItemsInner from './styled/SkeletonGlobalTopItemsInner';

const SkeletonGlobalTopItems = () => (
  <SkeletonGlobalTopItemsInner>
    <SkeletonNavigationItems>
      <SkeletonGlobalPrimaryIconOuter>
        <SkeletonIcon size="xlarge" weight="strong" />
      </SkeletonGlobalPrimaryIconOuter>
      <SkeletonGlobalIconOuter>
        <SkeletonIcon size="large" />
      </SkeletonGlobalIconOuter>
      <SkeletonGlobalIconOuter>
        <SkeletonIcon size="large" />
      </SkeletonGlobalIconOuter>
    </SkeletonNavigationItems>
  </SkeletonGlobalTopItemsInner>
);

SkeletonGlobalTopItems.displayName = 'SkeletonGlobalTopItems';
export default SkeletonGlobalTopItems;
