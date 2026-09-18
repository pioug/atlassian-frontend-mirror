import React from 'react';

import SkelItem from '@atlaskit/menu/skeleton-item';
import type { SkeletonItemProps } from '@atlaskit/menu/types';

import { useShouldNestedElementRender } from '../NestableNavigationContent/use-should-nested-element-render';

/**
 * __Skeleton item__
 *
 * A skeleton item can be used to reduce the perceived loading time.
 *
 * - [Examples](https://atlassian.design/components/side-navigation/examples#loading)
 * - [Code](https://atlassian.design/components/side-navigation/code)
 *
 * @deprecated `@atlaskit/side-navigation` is deprecated. Use `@atlaskit/navigation-system` instead.
 */
export const SkeletonItem = (props: SkeletonItemProps): React.JSX.Element | null => {
	const { shouldRender } = useShouldNestedElementRender();
	if (!shouldRender) {
		return null;
	}

	return (
		<SkelItem
			isSideNavSkeleton
			// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
			{...props}
		/>
	);
};
