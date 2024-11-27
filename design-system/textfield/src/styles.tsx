import { fg } from '@atlaskit/platform-feature-flags';
import { media } from '@atlaskit/primitives';
import { B200, N0, N10, N100, N200, N30, N70, N900, R400 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { type Appearance } from './types';

const backgroundColor = {
	standard: token('color.background.input', N10),
	subtle: 'transparent',
	none: 'transparent',
};

const backgroundColorFocus = {
	standard: token('color.background.input.pressed', N0),
	subtle: token('color.background.input.pressed', N0),
	none: 'transparent',
};

const backgroundColorHover = {
	standard: token('color.background.input.hovered', N30),
	subtle: token('color.background.input.hovered', N30),
	none: 'transparent',
};

const borderColor = {
	standard: token('color.border.input', N100),
	subtle: 'transparent',
	none: 'transparent',
};

const borderColorFocus = {
	standard: token('color.border.focused', B200),
	subtle: token('color.border.focused', B200),
	none: 'transparent',
};

const borderColorHover = {
	standard: token('color.border.input', N100),
	subtle: token('color.border.input', 'transparent'),
	none: 'transparent',
};

const getContainerTextBgAndBorderColor = (appearance: Appearance) => ({
	backgroundColor: backgroundColor[appearance],
	borderColor: borderColor[appearance],
	color: token('color.text', N900),
	cursor: 'text',
	'&:hover:not([data-disabled])': {
		backgroundColor: backgroundColorHover[appearance],
		borderColor: borderColorHover[appearance],
	},
	'&:focus-within:not([data-disabled])': {
		backgroundColor: backgroundColorFocus[appearance],
		borderColor: borderColorFocus[appearance],
		boxShadow: `inset 0 0 0 ${token('border.width', '1px')} ${borderColorFocus[appearance]}`,
	},
	'&[data-disabled]': {
		color: token('color.text.disabled', N70),
		cursor: 'not-allowed',
		// Disabled background and border styles should not be applied to components that
		// have either no background or transparent background to begin with
		...(appearance === 'standard' && {
			backgroundColor: token('color.background.disabled', N10),
			borderColor: token('color.background.disabled', N10),
		}),
	},
	'&[data-invalid], &[data-invalid]:hover': {
		borderColor: token('color.border.danger', R400),
		boxShadow: `inset 0 0 0 ${token('border.width', '1px')} ${token('color.border.danger', R400)}`,
	},
	'&[data-invalid]:focus-within': {
		backgroundColor: token('color.background.input.pressed', N0),
		borderColor: token('color.border.focused', B200),
		boxShadow: `inset 0 0 0 ${token('border.width', '1px')} ${token('color.border.focused', B200)}`,
	},
	'@media screen and (-ms-high-contrast: active)': {
		'&[data-invalid]:focus-within': {
			borderColor: 'Highlight',
		},
		'&:focus-within': {
			borderColor: 'Highlight',
		},
		'&[data-disabled]': {
			borderColor: 'GrayText',
		},
	},
});

const widthMap: { [key: string]: number } = {
	xsmall: 80,
	small: 160,
	medium: 240,
	large: 320,
	xlarge: 480,
};

const getMaxWidth = (width: string | number | undefined): number | string =>
	!width ? `100%` : width in widthMap ? widthMap[width] : +width;

export const containerStyles = (appearance: Appearance, width?: string | number) =>
	({
		alignItems: 'center',
		...getContainerTextBgAndBorderColor(appearance),
		borderRadius: 3,
		borderWidth: token('border.width', '1px'),
		// add 1px padding on both top and bottom to keep the same overall height after border reduced from 2px to 1px under feature flag
		...(appearance !== 'none' ? { padding: `${token('border.width', '1px')} 0` } : {}),
		borderStyle: appearance === 'none' ? 'none' : 'solid',
		boxSizing: 'border-box',
		display: 'flex',
		flex: '1 1 100%',
		font: token('font.body'),
		justifyContent: 'space-between',
		maxWidth: getMaxWidth(width),
		overflow: 'hidden',
		transition: `background-color 0.2s ease-in-out, border-color 0.2s ease-in-out`,
		wordWrap: 'break-word',
		verticalAlign: 'top',
		pointerEvents: 'auto',
	}) as const;

export const inputStyles = () =>
	({
		backgroundColor: 'transparent',
		border: 0,
		boxSizing: 'border-box',
		color: 'inherit',
		cursor: 'inherit',
		font: fg('platform_design_system_team_safari_input_fix')
			? token('font.body.large')
			: token('font.body'),
		minWidth: '0',
		outline: 'none',
		width: '100%',
		'&[data-monospaced]': {
			fontFamily: token('font.family.code'),
		},
		'&[data-compact]': {
			padding: fg('platform_design_system_team_safari_input_fix')
				? `${token('space.025', '2px')} ${token('space.075', '6px')}`
				: `${token('space.050', '4px')} ${token('space.075', '6px')}`,
		},
		'&:not([data-compact])': {
			padding: fg('platform_design_system_team_safari_input_fix')
				? `${token('space.075', '6px')} ${token('space.075', '6px')}`
				: `${token('space.100', '8px')} ${token('space.075', '6px')}`,
		},
		'&[disabled]': {
			// Safari (WebKit) adds a -webkit-text-fill-color style to disabled inputs
			// which takes priority over color and makes the text unreadable. Need to
			// override it with the color we want.
			WebkitTextFillColor: token('color.text.disabled', N70),
		},
		// Hide the clear indicator on Edge (Windows only)
		'&::-ms-clear': {
			display: 'none',
		},
		'&:invalid': {
			boxShadow: 'none',
		},
		'&:placeholder-shown': {
			textOverflow: 'ellipsis',
		},
		'&::placeholder': {
			color: token('color.text.subtlest', N200),
			'&:disabled': {
				color: token('color.text.disabled', N70),
			},
		},
		'@media screen and (-ms-high-contrast: active)': {
			'&[disabled]': {
				color: 'GrayText',
			},
		},
		[`${media.above.xs}`]: {
			font: fg('platform_design_system_team_safari_input_fix') ? token('font.body') : undefined,
			'&[data-compact]': {
				padding: fg('platform_design_system_team_safari_input_fix')
					? `${token('space.050', '4px')} ${token('space.075', '6px')}`
					: undefined,
			},
			'&:not([data-compact])': {
				padding: fg('platform_design_system_team_safari_input_fix')
					? `${token('space.100', '8px')} ${token('space.075', '6px')}`
					: undefined,
			},
		},
	}) as const;
