import React from 'react';

// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { SkeletonHeadingItem } from '@atlaskit/side-navigation/skeleton-heading-item';

const Example = (): React.JSX.Element => (
	<>
		<SkeletonHeadingItem />
		<SkeletonHeadingItem isShimmering />
	</>
);

export default Example;
