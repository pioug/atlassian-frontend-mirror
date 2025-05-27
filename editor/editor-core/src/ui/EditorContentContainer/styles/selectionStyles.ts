import { css } from '@emotion/react'; // eslint-disable-line @atlaskit/ui-styling-standard/use-compiled

import { token } from '@atlaskit/tokens';

// TODO: ED-28075 - refactor selection styles to unblock Compiled CSS migration
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const hideNativeBrowserTextSelectionStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'&::selection,*::selection': {
		backgroundColor: 'transparent',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors,@atlaskit/ui-styling-standard/no-unsafe-selectors
	'&::-moz-selection,*::-moz-selection': {
		backgroundColor: 'transparent',
	},
});

// TODO: ED-28075 - refactor selection styles to unblock Compiled CSS migration
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const borderSelectionStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-unsafe-values
	border: `1px solid ${token('color.border.selected')}`,

	// Fixes ED-15246: Trello card is visible through a border of a table border
	'&::after': {
		height: '100%',
		content: "'\\00a0'",
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-unsafe-values
		background: token('color.border.selected'),
		position: 'absolute',
		right: -1,
		top: 0,
		bottom: 0,
		width: 1,
		border: 'none',
		display: 'inline-block',
	},
});

// TODO: ED-28075 - refactor selection styles to unblock Compiled CSS migration
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const boxShadowSelectionStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-unsafe-values
	boxShadow: `0 0 0 1px ${token('color.border.selected')}`,
	borderColor: 'transparent',
});

// TODO: ED-28075 - refactor selection styles to unblock Compiled CSS migration
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const backgroundSelectionStyles = css({
	backgroundColor: token('color.background.selected'),
});

// TODO: ED-28075 - refactor selection styles to unblock Compiled CSS migration
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const blanketSelectionStyles = css({
	position: 'relative',
	// Fixes ED-9263, where emoji or inline card in panel makes selection go outside the panel
	// in Safari. Looks like it's caused by user-select: all in the emoji element
	'-webkit-user-select': 'text',

	'&::before': {
		position: 'absolute',
		content: "''",
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		width: '100%',
		pointerEvents: 'none',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values,@atlaskit/ui-styling-standard/no-unsafe-values
		zIndex: 12,
		backgroundColor: token('color.blanket.selected'),
	},
});
