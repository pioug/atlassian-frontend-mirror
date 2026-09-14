import React from 'react';

import Skeleton from '@atlaskit/avatar/skeleton';

const AvatarSkeletonSizeExample = (): React.JSX.Element => {
	return (
		<div>
			<Skeleton size="xxsmall" />
			<Skeleton size="small" />
			<Skeleton size="medium" />
			<Skeleton size="large" />
			<Skeleton size="xlarge" />
			<Skeleton size="xxlarge" />
		</div>
	);
};

export default AvatarSkeletonSizeExample;
