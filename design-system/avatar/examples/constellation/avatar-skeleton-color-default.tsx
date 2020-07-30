import React from 'react';

import { colors } from '@atlaskit/theme';

import { Skeleton } from '../../src';

export default function AvatarSkeletonColorDefaultExample() {
  return (
    <div style={{ color: colors.P500 }}>
      <Skeleton />
    </div>
  );
}
