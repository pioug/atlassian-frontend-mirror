// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const triggerButtonStyles = css({
	all: 'unset',
	backgroundColor: 'transparent',
	color: 'unset',
	cursor: 'pointer',
	fontFamily: 'unset',
	fontSize: 'unset',
	fontStyle: 'unset',
	fontWeight: 'unset',
	fontVariant: 'unset',
	lineHeight: 0,
	padding: 0,
	textTransform: 'unset',
	border: '2px solid transparent',
	margin: token('space.025', '2px'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	"&:focus-visible, &:focus-within, &[aria-expanded='true']": {
		outline: 'none',
		boxShadow: `0 0 0 2px ${token('color.border.focused', '#388BFF')}`,
		borderRadius: '5px',
	},
});

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const triggerLozengeStyles = css({
	alignItems: 'center',
	display: 'flex',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	"span[role='img']": {
		margin: `${token('space.negative.050', '-4px')} ${token(
			'space.negative.100',
			'-8px',
		)} ${token('space.negative.050', '-4px')} -1px`,
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const dropdownItemGroupStyles = css({
	maxHeight: '300px',
	overflowY: 'auto',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	button: {
		padding: `${token('space.075', '6px')} ${token('space.150', '12px')}`,
		minHeight: '28px',
		width: '220px',
		'&:hover': {
			backgroundColor: 'inherit',
		},
		'&:focus, &:focus-visible': {
			backgroundColor: token('color.background.neutral.subtle.hovered', '#091E420F'),
			boxSizing: 'border-box',
			boxShadow: `inset 2px 0 0 ${token('color.border.selected', '#0C66E4')}`,
			outline: 'none',
		},
	},
});
