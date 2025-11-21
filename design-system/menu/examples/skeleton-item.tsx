import React from 'react';

import { cssMap } from '@compiled/react';

import { SkeletonItem } from '@atlaskit/menu';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	customPadding: {
		paddingBlock: token('space.400'),
	},
});

export default (): React.JSX.Element => (
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
