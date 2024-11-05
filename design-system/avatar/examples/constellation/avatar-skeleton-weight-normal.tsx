import React from 'react';

import { Skeleton } from '@atlaskit/avatar';
import { token } from '@atlaskit/tokens';


const AvatarSkeletonWeightNormalExample = () => {
	return <Skeleton color={token('color.background.accent.yellow.subtler')} weight="normal" />;
};

export default AvatarSkeletonWeightNormalExample;
