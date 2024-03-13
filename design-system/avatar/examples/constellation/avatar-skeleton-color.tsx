import React from 'react';

import { token } from '@atlaskit/tokens';

import { Skeleton } from '../../src';

const AvatarSkeletonColorExample = () => {
  return <Skeleton color={token('color.background.accent.blue.subtler')} />;
};

export default AvatarSkeletonColorExample;
