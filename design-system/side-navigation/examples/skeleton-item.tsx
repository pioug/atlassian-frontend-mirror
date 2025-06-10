import React from 'react';

import { SkeletonItem } from '@atlaskit/side-navigation';

const Example = () => (
	<>
		<SkeletonItem />
		<SkeletonItem hasAvatar />
		<SkeletonItem hasIcon isShimmering />
		<SkeletonItem isShimmering />
	</>
);

export default Example;
