import React from 'react';

import { cssMap } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';

import { SkeletonHeadingItem } from '../src';

const styles = cssMap({
	customPadding: {
		paddingBlock: token('space.400'),
	},
});

export default () => (
	<>
		<SkeletonHeadingItem />
		<SkeletonHeadingItem isShimmering testId="is-shimmering" />
		<SkeletonHeadingItem isShimmering xcss={styles.customPadding} />
	</>
);
