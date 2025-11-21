import React from 'react';

import { SkeletonItem } from '@atlaskit/side-navigation';

const Example = (): React.JSX.Element => (
	<>
		<SkeletonItem />
		<SkeletonItem hasAvatar />
		<SkeletonItem hasIcon isShimmering />
		<SkeletonItem isShimmering />
	</>
);

export default Example;
