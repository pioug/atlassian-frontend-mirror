import React from 'react';

import { SkeletonItem } from '../src';

export default () => (
	<>
		<SkeletonItem />
		<div data-testid="is-shimmering">
			<SkeletonItem isShimmering />
			<SkeletonItem hasAvatar isShimmering />
			<SkeletonItem hasIcon isShimmering />
		</div>
	</>
);
