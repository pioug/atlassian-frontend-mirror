import React from 'react';

import { Skeleton } from '@atlaskit/avatar';
import { token } from '@atlaskit/tokens';

const AvatarSkeletonColorExample = (): React.JSX.Element => {
	return <Skeleton color={token('color.background.accent.blue.subtler')} />;
};

export default AvatarSkeletonColorExample;
