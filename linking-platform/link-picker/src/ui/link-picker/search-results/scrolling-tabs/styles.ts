// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, type SerializedStyles } from '@emotion/react';

import { N0, N30 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const scrollingContainerStyles: SerializedStyles = css({
	overflowX: 'auto',
	scrollBehavior: 'smooth',
	scrollPadding: '0 24px',
	scrollbarWidth: 'none',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'&::-webkit-scrollbar': {
		display: 'none',
	},
	'&::before': {
		content: '""',
		borderRadius: 2,
		bottom: 0,
		margin: 0,
		position: 'absolute',
		width: 'inherit',
		left: token('space.100', '8px'),
		right: token('space.100', '8px'),
		height: 2,
		backgroundColor: token('color.border', N30),
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const containerStyles: SerializedStyles = css({
	position: 'relative',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'[role="tablist"]': {
		'&::before': {
			display: 'none',
		},
	},
	// Overrides Atlaskit tabs styles to stop overflowing with ellipsis
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'[role="tab"]': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles -- Ignored via go/DSP-18766
		overflow: 'unset !important',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles -- Ignored via go/DSP-18766
		textOverflow: 'unset !important',
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const buttonContainerStyles: SerializedStyles = css({
	position: 'absolute',
	top: token('space.050', '4px'),
	zIndex: 999,
	backgroundColor: token('elevation.surface', N0),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-array-arguments, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const backButtonStyles: SerializedStyles = css([
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	buttonContainerStyles,
	{
		left: 0,
	},
]);

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-array-arguments, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const nextButtonStyles: SerializedStyles = css([
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	buttonContainerStyles,
	{
		right: 0,
	},
]);
