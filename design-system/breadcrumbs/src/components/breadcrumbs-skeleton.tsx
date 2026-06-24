/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { cssMap, jsx } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';

import { type BreadcrumbsSkeletonProps } from '../types';

import BreadcrumbsSkeletonItem from './breadcrumbs-skeleton-item';
import { BreadcrumbsSkeletonContext } from './internal/breadcrumbs-skeleton-context';

const styles = cssMap({
	nav: {
		maxWidth: '100%',
	},
	list: {
		display: 'flex',
		alignItems: 'center',
		flexWrap: 'wrap',
		listStyleType: 'none',
		marginBlockEnd: token('space.0'),
		marginBlockStart: token('space.0'),
		marginInlineEnd: token('space.0'),
		marginInlineStart: token('space.0'),
		paddingBlockEnd: token('space.0'),
		paddingBlockStart: token('space.0'),
		paddingInlineEnd: token('space.0'),
		paddingInlineStart: token('space.0'),
	},
});

const defaultItems = [
	<BreadcrumbsSkeletonItem key="home" width={64} />,
	<BreadcrumbsSkeletonItem key="parent" width={96} />,
	<BreadcrumbsSkeletonItem key="current" width={80} />,
];

/**
 * __BreadcrumbsSkeleton__
 *
 * A placeholder skeleton for breadcrumbs while navigation data is loading.
 */
export default function BreadcrumbsSkeleton({
	children,
	isShimmering = true,
	label = 'Loading breadcrumbs',
	size = 'medium',
	testId,
}: BreadcrumbsSkeletonProps): React.JSX.Element {
	const renderedChildren = React.Children.count(children) > 0 ? children : defaultItems;

	return (
		<BreadcrumbsSkeletonContext.Provider value={{ isShimmering, size }}>
			<nav aria-busy="true" aria-label={label} css={styles.nav}>
				<ol aria-hidden="true" data-testid={testId} css={styles.list}>
					{renderedChildren}
				</ol>
			</nav>
		</BreadcrumbsSkeletonContext.Provider>
	);
}
