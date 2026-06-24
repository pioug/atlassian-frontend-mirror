/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { cssMap as unboundedCssMap } from '@compiled/react';

import { cssMap, jsx } from '@atlaskit/css';
import Skeleton from '@atlaskit/skeleton';
import { token } from '@atlaskit/tokens';

import { type BreadcrumbsSkeletonItemProps } from '../types';

import { useBreadcrumbsSkeleton } from './internal/use-breadcrumbs-skeleton';

const styles = cssMap({
	item: {
		display: 'flex',
		alignItems: 'center',
		boxSizing: 'border-box',
		height: '1.5rem',
		maxWidth: '100%',
	},
	iconWrapper: {
		display: 'inline-flex',
		alignItems: 'center',
		justifyContent: 'center',
		width: '24px',
		height: '24px',
		marginInlineEnd: token('space.025'),
	},
});

const unboundedStyles = unboundedCssMap({
	item: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- separator only applies between adjacent skeleton items
		'&:not(:last-of-type)::after': {
			width: '8px',
			flexShrink: 0,
			color: token('color.text.subtlest'),
			content: '"/"',
			paddingBlock: token('space.025'),
			paddingInline: token('space.100'),
			textAlign: 'center',
		},
	},
});

/**
 * __BreadcrumbsSkeletonItem__
 *
 * A placeholder skeleton item for use inside `BreadcrumbsSkeleton`.
 */
export default function BreadcrumbsSkeletonItem({
	hasIcon,
	width,
}: BreadcrumbsSkeletonItemProps): React.JSX.Element {
	const { isShimmering, size } = useBreadcrumbsSkeleton();

	return (
		<li css={[styles.item, unboundedStyles.item]}>
			{hasIcon ? (
				<span css={styles.iconWrapper}>
					<Skeleton height={16} isShimmering={isShimmering} width={16} />
				</span>
			) : null}
			<Skeleton height={size === 'small' ? 12 : 14} isShimmering={isShimmering} width={width} />
		</li>
	);
}
