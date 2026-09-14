import React from 'react';

import { cssMap } from '@atlaskit/css';
import MenuSkeletonHeadingItem from '@atlaskit/menu/skeleton-heading-item';
import type { SkeletonHeadingItemProps as MenuSkeletonHeadingItemProps } from '@atlaskit/menu/types';
import { token } from '@atlaskit/tokens';

import { useShouldNestedElementRender } from '../NestableNavigationContent/use-should-nested-element-render';

const styles = cssMap({
	root: {
		paddingInline: token('space.100'),
	},
});

/**
 * @deprecated `@atlaskit/side-navigation` is deprecated. Use `@atlaskit/navigation-system` instead.
 */
export interface SkeletonHeadingItemProps extends MenuSkeletonHeadingItemProps {}
/**
 * __Skeleton heading item__
 *
 * A skeleton heading item for use in managing loading states.
 *
 * - [Examples](https://atlassian.design/components/side-navigation/examples#loading)
 *
 * @deprecated `@atlaskit/side-navigation` is deprecated. Use `@atlaskit/navigation-system` instead.
 */
export const SkeletonHeadingItem = (props: SkeletonHeadingItemProps): React.JSX.Element | null => {
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
