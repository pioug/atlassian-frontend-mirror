import React from 'react';

import { token } from '@atlaskit/tokens';

import { Skeleton } from '../../src';

const AvatarSkeletonWeightNormalExample = () => {
	return <Skeleton color={token('color.background.accent.yellow.subtler')} weight="normal" />;
};

export default AvatarSkeletonWeightNormalExample;
