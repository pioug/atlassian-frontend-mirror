import React from 'react';

import { cssMap } from '@compiled/react';

import { token } from '@atlaskit/tokens';

import { SkeletonItem } from '../src';

const styles = cssMap({
	customPadding: {
		paddingBlock: token('space.400'),
	},
});

export default () => (
	<>
		<SkeletonItem />
		<div data-testid="is-shimmering">
			<SkeletonItem isShimmering />
			<SkeletonItem hasAvatar isShimmering />
			<SkeletonItem hasIcon isShimmering />
			<SkeletonItem isShimmering xcss={styles.customPadding} />
		</div>
	</>
);
