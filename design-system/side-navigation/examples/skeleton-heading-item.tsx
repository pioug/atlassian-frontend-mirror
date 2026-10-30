import React from 'react';

import { SkeletonHeadingItem } from '@atlaskit/side-navigation/skeleton-heading-item';

const Example = (): React.JSX.Element => (
	<>
		<SkeletonHeadingItem />
		<SkeletonHeadingItem isShimmering />
	</>
);

export default Example;
