import React from 'react';

// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
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
