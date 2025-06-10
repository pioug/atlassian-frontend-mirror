import React from 'react';

import { cssMap } from '@atlaskit/css';
import { SkeletonHeadingItem } from '@atlaskit/menu';
import { token } from '@atlaskit/tokens';

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
