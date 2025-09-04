/**
 * @jsxRuntime classic
 * @jsx jsx
 */

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import { useTheme } from '../../theme';

import { type PrimaryButtonSkeletonProps } from './types';

const paddingAll = 4;
const buttonHeight = 32;

const skeletonStyles = css({
	display: 'inline-flex',
	width: '68px',
	height: `${buttonHeight - paddingAll * 2.5}px`,
	borderRadius: token('radius.small', '4px'),
	opacity: 0.15,
});

// Not exported to consumers, only used in NavigationSkeleton
// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const PrimaryButtonSkeleton = (props: PrimaryButtonSkeletonProps) => {
	const theme = useTheme();

	return (
		<div
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			style={theme.mode.skeleton as React.CSSProperties}
			css={skeletonStyles}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className={props.className}
		/>
	);
};
