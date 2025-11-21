import React from 'react';

import { cssMap } from '@atlaskit/css';
import {
	SkeletonHeadingItem as MenuSkeletonHeadingItem,
	type SkeletonHeadingItemProps,
} from '@atlaskit/menu';
import { token } from '@atlaskit/tokens';

import { useShouldNestedElementRender } from '../NestableNavigationContent/context';

export type { SkeletonHeadingItemProps } from '@atlaskit/menu';

const styles = cssMap({
	root: {
		paddingInline: token('space.100', '8px'),
	},
});

/**
 * __Skeleton heading item__
 *
 * A skeleton heading item for use in managing loading states.
 *
 * - [Examples](https://atlassian.design/components/side-navigation/examples#loading)
 */
const SkeletonHeadingItem = (props: SkeletonHeadingItemProps): React.JSX.Element | null => {
	const { shouldRender } = useShouldNestedElementRender();
	if (!shouldRender) {
		return null;
	}

	return (
		<MenuSkeletonHeadingItem
			xcss={styles.root}
			// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
			{...props}
		/>
	);
};

export default SkeletonHeadingItem;
