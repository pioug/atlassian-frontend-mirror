/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { Fragment, memo, type MemoExoticComponent } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import { PrimaryButtonSkeleton } from '../PrimaryButton/skeleton';

import { type PrimaryItemsContainerSkeletonProps } from './types';

const primaryButtonSkeletonStyles = css({
	marginInlineEnd: token('space.150', '12px'),
	marginInlineStart: token('space.150', '12px'),
});

// Internal only
// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const PrimaryItemsContainerSkeleton: MemoExoticComponent<({ count }: PrimaryItemsContainerSkeletonProps) => React.JSX.Element> = memo(
	({ count }: PrimaryItemsContainerSkeletonProps): React.JSX.Element => (
		<Fragment>
			{Array.from({ length: count }, (_, index) => (
				<PrimaryButtonSkeleton key={index} css={primaryButtonSkeletonStyles} />
			))}
		</Fragment>
	),
);
