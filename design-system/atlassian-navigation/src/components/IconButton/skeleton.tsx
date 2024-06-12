/** @jsx jsx */
import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import { useTheme } from '../../theme';

import { type IconButtonSkeletonProps } from './types';

const buttonHeight = token('space.400', '32px');

const skeletonStyles = css({
	borderRadius: token('border.radius.circle', '50%'),
	opacity: 0.15,
});

// Not exported to consumers, only used in NavigationSkeleton
// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const IconButtonSkeleton = ({
	className,
	marginLeft,
	marginRight,
	size,
}: IconButtonSkeletonProps) => {
	const theme = useTheme();

	const dynamicStyles = {
		marginLeft: typeof marginLeft === 'number' ? marginLeft : token('space.050', '4px'),
		marginRight: typeof marginRight === 'number' ? marginRight : 0,
		width: typeof size === 'number' ? size : buttonHeight,
		height: typeof size === 'number' ? size : buttonHeight,
		...theme.mode.skeleton,
	};

	return (
		<div
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className={className}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			style={dynamicStyles as React.CSSProperties}
			css={skeletonStyles}
		/>
	);
};
