/** @jsx jsx */
import { Fragment, memo } from 'react';

import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import { PrimaryButtonSkeleton } from '../PrimaryButton/skeleton';

import { type PrimaryItemsContainerSkeletonProps } from './types';

const primaryButtonSkeletonStyles = css({
	marginRight: token('space.150', '12px'),
	marginLeft: token('space.150', '12px'),
});

// Internal only
// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const PrimaryItemsContainerSkeleton = memo(
	({ count }: PrimaryItemsContainerSkeletonProps) => (
		<Fragment>
			{Array.from({ length: count }, (_, index) => (
				<PrimaryButtonSkeleton key={index} css={primaryButtonSkeletonStyles} />
			))}
		</Fragment>
	),
);
