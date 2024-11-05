import React from 'react';

import { Skeleton } from '@atlaskit/avatar';
import { token } from '@atlaskit/tokens';


const AvatarSkeletonColorExample = () => {
	return <Skeleton color={token('color.background.accent.blue.subtler')} />;
};

export default AvatarSkeletonColorExample;
