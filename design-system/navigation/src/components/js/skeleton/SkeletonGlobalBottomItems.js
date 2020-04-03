import React from 'react';

import { Skeleton as SkeletonIcon } from '@atlaskit/icon';

import SkeletonNavigationItems from './styled/SkeletonNavigationItems';
import SkeletonGlobalIconOuter from './styled/SkeletonGlobalIconOuter';

const SkeletonGlobalBottomItems = () => (
  <SkeletonNavigationItems>
    <SkeletonGlobalIconOuter>
      <SkeletonIcon size="medium" />
    </SkeletonGlobalIconOuter>
    <SkeletonGlobalIconOuter>
      <SkeletonIcon size="large" weight="strong" />
    </SkeletonGlobalIconOuter>
  </SkeletonNavigationItems>
);

SkeletonGlobalBottomItems.displayName = 'SkeletonGlobalBottomItems';
export default SkeletonGlobalBottomItems;
