import React from 'react';

import { type SkeletonItemProps, SkeletonItem as SkelItem } from '@atlaskit/menu';

import { useShouldNestedElementRender } from '../NestableNavigationContent/context';

export type { SkeletonItemProps } from '@atlaskit/menu';

/**
 * __Skeleton item__
 *
 * A skeleton item can be used to reduce the perceived loading time.
 *
 * - [Examples](https://atlassian.design/components/side-navigation/examples#loading)
 * - [Code](https://atlassian.design/components/side-navigation/code)
 */
const SkeletonItem = (props: SkeletonItemProps): React.JSX.Element | null => {
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

export default SkeletonItem;
