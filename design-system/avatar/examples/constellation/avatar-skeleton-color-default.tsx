/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
import React from 'react';

import { P500 } from '@atlaskit/theme/colors';

import { Skeleton } from '../../src';

const AvatarSkeletonColorDefaultExample = () => {
  return (
    <div style={{ color: P500 }}>
      <Skeleton />
    </div>
  );
};

export default AvatarSkeletonColorDefaultExample;
