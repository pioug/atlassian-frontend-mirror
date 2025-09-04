// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, type CSSObject } from '@emotion/react';

import { fg } from '@atlaskit/platform-feature-flags';
import {
	// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
	gridSize as getGridSize,
} from '@atlaskit/theme/constants';
import { type ThemeModes } from '@atlaskit/theme/types';
import { token } from '@atlaskit/tokens';

import { type Appearance, type Spacing } from '../types';

import colors, { type ColorGroup, type ColorRule } from './colors';

const gridSize: number = getGridSize();
const HAS_DISABLED_BACKGROUND = ['default', 'primary', 'danger', 'warning'];

// ## Button layout
//
// /------------------------------------------------------------------------------------------------------------------\
// |       →  |  ←      |          |      →  |  ←      |           |      →  |  ←      |         |      →  |  ←       |
// |  10px →  |  ← 2px  |   icon   |  2px →  |  ← 2px  |           |  2px →  |  ← 2px  |  icon   |  2px →  |  ← 10px  |
// |  padding |  margin |  before  |  margin |  margin |  content  |  margin |  margin |  after  |  margin |  padding |
// |    (12px total)    |          |    (4px total)    |           |    (4px total)    |         |    (12px total)    |
// |       →  |  ←      |          |      →  |  ←      |           |      →  |  ←      |         |      →  |  ←       |
// \------------------------------------------------------------------------------------------------------------------/
//                                           ↑                               ↑
//                                        Margins don't collapse with inline-flex
//
const heights: { [key in Spacing]: string } = {
	default: `${32 / 14}em`, // 32px
	compact: `${24 / 14}em`,
	none: 'auto',
};
const lineHeights: { [key in Spacing]: string } = {
	default: heights.default,
	compact: heights.compact,
	none: 'inherit',
};
const padding: { [key in Spacing]: string } = {
	// 10px gutter
	default: `0 ${gridSize + gridSize / 4}px`,
	compact: `0 ${gridSize + gridSize / 4}px`,
	none: '0',
};
const singleIconPadding: { [key in Spacing]: string } = {
	// 2px gutter
	compact: `0 ${gridSize / 4}px`,
	default: `0 ${gridSize / 4}px`,
	none: '0',
};

const verticalAlign: { [key in Spacing]: string } = {
	default: 'middle',
	compact: 'middle',
	none: 'baseline',
};

const innerMargin = {
	content: `0 ${gridSize / 4}px`,
	icon: `0 ${gridSize / 4}px`,
};

const defaultAfterStyles: CSSObject = {
	borderRadius: 'inherit',
	inset: token('space.0'),
	borderStyle: 'solid',
	borderWidth: token('border.width'),
	pointerEvents: 'none',
	position: 'absolute',
};

const defaultStyles: CSSObject = {
	background: token('color.background.neutral.subtle'),
	color: token('color.text'),

	'&::after': {
		...defaultAfterStyles,
		content: '""',
		borderColor: token('color.border'),
	},

	'&:hover': {
		background: token('color.background.neutral.hovered'),
	},

	'&:active': {
		background: token('color.background.neutral.pressed'),
	},

	'&[data-has-overlay="true"]:not([disabled]):hover': {
		background: token('color.background.neutral.subtle'),
	},

	'&:disabled[disabled]': {
		background: token('color.background.neutral.subtle'),
	},

	'&:disabled[disabled]:hover': {
		background: token('color.background.neutral.subtle'),
	},

	'&:disabled[disabled]:active': {
		background: token('color.background.neutral.subtle'),
	},
};

const primaryStyles: CSSObject = {
	background: token('color.background.brand.bold'),
	color: token('color.text.inverse'),

	'&:hover': {
		background: token('color.background.brand.bold.hovered'),
	},

	'&:active': {
		background: token('color.background.brand.bold.pressed'),
	},

	'&[data-has-overlay="true"]:not([disabled]):hover': {
		background: token('color.background.brand.bold'),
	},
};

const linkStyles: CSSObject = {
	background: 'transparent',
	color: token('color.link'),

	'&:hover': {
		color: token('color.link'),
		textDecoration: 'underline',
	},

	'&:active': {
		color: token('color.link.pressed'),
		textDecoration: 'underline',
	},
};

const subtleStyles: CSSObject = {
	background: 'transparent',
	color: token('color.text.subtle'),

	'&:hover': {
		background: token('color.background.neutral.subtle.hovered'),
	},

	'&:active': {
		background: token('color.background.neutral.subtle.pressed'),
	},

	'&[data-has-overlay="true"]:not([disabled]):hover': {
		background: 'transparent',
	},
};

const subtleLinkStyles: CSSObject = {
	background: 'transparent',
	color: token('color.text.subtle'),

	'&:hover': {
		background: 'transparent',
		color: token('color.text.subtle'),
		textDecoration: 'underline',
	},

	'&:active': {
		background: 'transparent',
		color: token('color.text'),
		textDecoration: 'underline',
	},
};

const warningStyles: CSSObject = {
	background: token('color.background.warning.bold'),
	color: token('color.text.warning.inverse'),

	'&:hover': {
		background: token('color.background.warning.bold.hovered'),
	},

	'&:active': {
		background: token('color.background.warning.bold.pressed'),
	},

	'&[data-has-overlay="true"]:not([disabled]):hover': {
		background: token('color.background.warning.bold'),
	},
};

const dangerStyles: CSSObject = {
	background: token('color.background.danger.bold'),
	color: token('color.text.inverse'),

	'&:hover': {
		background: token('color.background.danger.bold.hovered'),
	},

	'&:active': {
		background: token('color.background.danger.bold.pressed'),
	},

	'&[data-has-overlay="true"]:not([disabled]):hover': {
		background: token('color.background.danger.bold'),
	},
};

const selectedStyles: CSSObject = {
	background: token('color.background.selected'),
	color: token('color.text.selected'),

	'&:not([disabled])::after': {
		...defaultAfterStyles,
		content: '""',
		borderColor: token('color.border.selected'),
	},
};

const hasOverlayStyles: CSSObject = {
	'&[data-has-overlay="true"]': {
		cursor: 'default',
		textDecoration: 'none',
	},
};

function getColor({
	group,
	key,
	mode,
}: {
	group: ColorGroup;
	key: keyof ColorGroup;
	mode: ThemeModes;
}): string {
	const rule: ColorRule = group[key] || group.default;
	return rule[mode];
}

function getColors({
	appearance,
	key,
	mode,
}: {
	appearance: Appearance;
	key: keyof ColorGroup;
	mode: ThemeModes;
}) {
	return {
		background: getColor({
			group: colors.background[appearance],
			key,
			mode,
		}),
		// Needing to add !important to overcome specificity issue caused by deprecated AtlaskitThemeProvider
		color: `${getColor({
			group: colors.color[appearance],
			key,
			mode,
		})} !important`,
	};
}

type GetCssArgs = {
	appearance: Appearance;
	spacing: Spacing;
	mode: ThemeModes;
	isSelected: boolean;
	shouldFitContainer: boolean;
	isOnlySingleIcon: boolean;
};

export function getCss({
	appearance,
	spacing,
	mode,
	isSelected,
	shouldFitContainer,
	isOnlySingleIcon,
}: GetCssArgs): CSSObject {
	const baseColors = getColors({
		appearance,
		key: isSelected ? 'selected' : 'default',
		mode,
	});

	return {
		// 0px margin added to css-reset
		alignItems: 'baseline',
		borderWidth: 0,
		borderRadius: token('radius.small', '3px'),
		boxSizing: 'border-box',
		display: 'inline-flex',
		fontSize: 'inherit',
		fontStyle: 'normal',
		// Chrome recently changed button so that they use 'arial' as the font family
		fontFamily: 'inherit',
		fontWeight: token('font.weight.medium'),
		// margin for button has been applied to css reset
		maxWidth: '100%',
		// Needed to position overlay
		position: 'relative',
		textAlign: 'center',
		textDecoration: 'none',
		transition: 'background 0.1s ease-out, box-shadow 0.15s cubic-bezier(0.47, 0.03, 0.49, 1.38)',
		whiteSpace: 'nowrap',

		// dynamic styles
		...(!fg('platform-component-visual-refresh') && baseColors),

		cursor: 'pointer',
		height: heights[spacing],
		lineHeight: lineHeights[spacing],
		padding: isOnlySingleIcon ? singleIconPadding[spacing] : padding[spacing],
		verticalAlign: verticalAlign[spacing],
		width: shouldFitContainer ? '100%' : 'auto',
		// justifyContent required for shouldFitContainer buttons with an icon inside
		justifyContent: 'center',

		// Note: we cannot disable pointer events when there is an overlay.
		// That would be easy for styling, but it would start letting events through on disabled buttons

		...(!fg('platform-component-visual-refresh') && {
			// Disabling visited styles (just using the base colors)
			'&:visited': {
				...baseColors,
			},

			'&:hover': {
				...getColors({
					appearance,
					key: isSelected ? 'selected' : 'hover',
					mode,
				}),
				textDecoration:
					!isSelected && (appearance === 'link' || appearance === 'subtle-link')
						? 'underline'
						: 'inherit',
				// background, box-shadow
				transitionDuration: '0s, 0.15s',
			},

			// giving active styles preference by listing them after focus
			'&:active': {
				...getColors({
					appearance,
					key: isSelected ? 'selected' : 'active',
					mode,
				}),
				// background, box-shadow
				transitionDuration: '0s, 0s',
			},

			// preventDefault prevents regular active styles from applying in Firefox
			'&[data-firefox-is-active="true"]': {
				...getColors({
					appearance,
					key: isSelected ? 'selected' : 'active',
					mode,
				}),
				// background, box-shadow
				transitionDuration: '0s, 0s',
			},

			// Giving disabled styles preference over active by listing them after.
			// Not using '&:disabled' because :disabled is not a valid state for all element types
			// so we are targeting the attribute
			// Attributes have the same specificity a pseudo classes so we are overriding :disabled here
			'&[disabled]': {
				// always using 'disabled' even when selected
				...getColors({ appearance, key: 'disabled', mode }),
				cursor: 'not-allowed',
				textDecoration: 'none',
			},

			...hasOverlayStyles,

			// disabling hover and active color changes when there is an overlay, but the button is not disabled
			'&[data-has-overlay="true"]:not([disabled]):hover, &[data-has-overlay="true"]:not([disabled]):active':
				{
					...getColors({
						appearance,
						key: isSelected ? 'selected' : 'default',
						mode,
					}),
				},
		}),

		// dynamic colours for visual refresh:
		...(fg('platform-component-visual-refresh') &&
			(isSelected
				? selectedStyles
				: {
						...(appearance === 'default' && defaultStyles),
						...(appearance === 'primary' && primaryStyles),
						...(appearance === 'link' && linkStyles),
						...(appearance === 'subtle' && subtleStyles),
						...(appearance === 'subtle-link' && subtleLinkStyles),
						...(appearance === 'warning' && warningStyles),
						...(appearance === 'danger' && dangerStyles),

						'&[disabled]': {
							color: token('color.text.disabled'),
							backgroundColor: HAS_DISABLED_BACKGROUND.includes(appearance)
								? token('color.background.disabled')
								: 'transparent',
							cursor: 'not-allowed',
							textDecoration: 'none',

							'&:hovered': {
								backgroundColor: HAS_DISABLED_BACKGROUND.includes(appearance)
									? token('color.background.disabled')
									: 'transparent',
							},

							'&:active': {
								backgroundColor: HAS_DISABLED_BACKGROUND.includes(appearance)
									? token('color.background.disabled')
									: 'transparent',
							},
						},

						...hasOverlayStyles,
					})),

		'&::-moz-focus-inner': {
			border: 0,
			margin: 0,
			padding: 0,
		},
	};
}

// inline-flex child
export function getIconStyle({ spacing }: { spacing: Spacing }) {
	return css({
		display: 'flex',
		// icon size cannot grow and shrink
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		margin: spacing === 'none' ? 0 : innerMargin.icon,
		flexGrow: 0,
		flexShrink: 0,
		alignSelf: 'center',
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		fontSize: 0,
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		lineHeight: 0,
		userSelect: 'none',
	});
}

// inline-flex child
export function getContentStyle({ spacing }: { spacing: Spacing }) {
	return css({
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		margin: spacing === 'none' ? 0 : innerMargin.content,

		// content can grow and shrink
		flexGrow: 1,
		flexShrink: 1,

		// ellipsis for overflow text
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
	});
}

export function getFadingCss({ hasOverlay }: { hasOverlay: boolean }) {
	return css({
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		opacity: hasOverlay ? 0 : 1,
		transition: 'opacity 0.3s',
	});
}

export const overlayCss: CSSObject = {
	// stretching to full width / height of button
	// this is important as we need it to still block
	// event if clicking in the button's own padding
	position: 'absolute',
	left: 0,
	top: 0,
	right: 0,
	bottom: 0,

	// Putting all children in the center
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
};
