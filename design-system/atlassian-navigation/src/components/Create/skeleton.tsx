/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import { CREATE_BREAKPOINT } from '../../common/constants';
import { useTheme } from '../../theme';
import { IconButtonSkeleton } from '../IconButton/skeleton';

const buttonHeight = token('space.400', '32px');

const skeletonStyles = css({
	width: 68,
	height: buttonHeight,
	borderRadius: token('border.radius', '3px'),
	marginInlineStart: token('space.150', '12px'),
	opacity: 0.15,
});

const mobileStyles = css({
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	[`@media (max-width: ${CREATE_BREAKPOINT - 1}px)`]: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles -- Ignored via go/DSP-18766
		display: 'none !important',
	},
});

// Not exported to consumers, only used in NavigationSkeleton
// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const CreateSkeleton = () => {
	const theme = useTheme();
	return (
		<Fragment>
			<div
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				style={theme.mode.skeleton as React.CSSProperties}
				css={[skeletonStyles, mobileStyles]}
			/>
			<IconButtonSkeleton css={mobileStyles} size={26} />
		</Fragment>
	);
};
