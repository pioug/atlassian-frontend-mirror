import React from 'react';

import { token } from '@atlaskit/tokens';

import { Skeleton } from '../../src';

const AvatarSkeletonColorDefaultExample = () => {
  return (
    <div style={{ color: token('color.background.accent.purple.subtler') }}>
      <Skeleton />
    </div>
  );
};

export default AvatarSkeletonColorDefaultExample;
