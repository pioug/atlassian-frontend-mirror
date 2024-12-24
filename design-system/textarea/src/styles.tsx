/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, type CSSObject } from '@emotion/react';

import { fg } from '@atlaskit/platform-feature-flags';
import { media } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import * as componentTokens from './component-tokens';
import { type TextAreaProps } from './types';

const disabledRules = {
	backgroundColor: componentTokens.disabledBackground,
	backgroundColorFocus: componentTokens.disabledBackground,
	backgroundColorHover: componentTokens.disabledBackground,
	borderColor: componentTokens.disabledBorder,
	borderColorFocus: componentTokens.defaultBorderColorFocus,
	textColor: componentTokens.disabledTextColor,
};

const invalidRules = {
	borderColor: componentTokens.invalidBorderColor,
	borderColorFocus: componentTokens.defaultBorderColorFocus,
	backgroundColor: componentTokens.defaultBackgroundColor,
	backgroundColorFocus: componentTokens.defaultBackgroundColorFocus,
	backgroundColorHover: componentTokens.defaultBackgroundColorHover,
};

const backgroundColor = {
	standard: componentTokens.defaultBackgroundColor,
	subtle: componentTokens.transparent,
	none: componentTokens.transparent,
};

const backgroundColorFocus = {
	standard: componentTokens.defaultBackgroundColorFocus,
	subtle: componentTokens.defaultBackgroundColorFocus,
	none: componentTokens.transparent,
};

const backgroundColorHover = {
	standard: componentTokens.defaultBackgroundColorHover,
	subtle: componentTokens.defaultBackgroundColorHover,
	none: componentTokens.transparent,
};

const borderColor = {
	standard: componentTokens.defaultBorderColor,
	subtle: componentTokens.transparent,
	none: componentTokens.transparent,
};

const borderColorFocus = {
	standard: componentTokens.defaultBorderColorFocus,
	subtle: componentTokens.defaultBorderColorFocus,
	none: componentTokens.transparent,
};

const borderColorHover = {
	standard: componentTokens.defaultBorderColor,
	subtle: componentTokens.subtleBorderColorHover,
	none: componentTokens.transparent,
};

export interface StyleProps {
	minimumRows: number | undefined;
	resize: string | undefined;
	appearance: string | undefined;
	isMonospaced: boolean | undefined;
	maxHeight: string;
}
const lineHeightBase = 8 * 2.5;
const lineHeightCompact = 8 * 2;
const compactVerticalPadding = 2;
const verticalPadding = 6;
const horizontalPadding = 8;
const transitionDuration = '0.2s';
export const borderWidth = 2;

// Safari puts on some difficult to remove styles, mainly for disabled inputs
// but we want full control so need to override them in all cases
const overrideSafariDisabledStyles: CSSObject = {
	WebkitTextFillColor: 'unset',
	WebkitOpacity: '1',
};

const borderBoxMinHeight = (minimumRows: number, borderHeight: number) => {
	const contentHeight = lineHeightBase * minimumRows;
	return contentHeight + verticalPadding * 2 + borderHeight * 2;
};

const borderBoxMinHeightCompact = (minimumRows: number, borderHeight: number) => {
	const contentHeightCompact = lineHeightCompact * minimumRows;
	return contentHeightCompact + compactVerticalPadding * 2 + borderHeight * 2;
};

const bgAndBorderColorStyles = (appearance: TextAreaProps['appearance']) =>
	appearance &&
	css({
		'&:focus': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			backgroundColor: backgroundColorFocus[appearance],
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			borderColor: borderColorFocus[appearance],
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			boxShadow: `inset 0 0 0 ${token('border.width', '1px')} ${borderColorFocus[appearance]}`,
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
		'&:not(:focus)': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			backgroundColor: backgroundColor[appearance],
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			borderColor: borderColor[appearance],
		},
		// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'&[data-invalid]:focus': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			backgroundColor: invalidRules.backgroundColorFocus,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			borderColor: invalidRules.borderColorFocus,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			boxShadow: `inset 0 0 0 ${token('border.width', '1px')} ${invalidRules.borderColorFocus}`,
		},
		// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
		'&[data-invalid]:not(:focus)': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			backgroundColor: invalidRules.backgroundColor,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			borderColor: invalidRules.borderColor,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			boxShadow: `inset 0 0 0 ${token('border.width', '1px')} ${invalidRules.borderColor}`,
		},
		// Disabled background and border styles should not be applied to components that
		// have either no background or transparent background to begin with
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		...(appearance === 'standard'
			? {
					'&:disabled:focus': {
						backgroundColor: disabledRules.backgroundColorFocus,
						borderColor: disabledRules.borderColorFocus,
					},
					'&:disabled:not(:focus)': {
						backgroundColor: disabledRules.backgroundColor,
						borderColor: disabledRules.borderColor,
					},
				}
			: {}),
	});

const placeholderStyles = css({
	'&::placeholder': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		color: componentTokens.placeholderTextColor,
	},
	'&:disabled::placeholder': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		color: disabledRules.textColor,
	},
});

const hoverBackgroundAndBorderStyles = (appearance: TextAreaProps['appearance']) =>
	appearance &&
	css({
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
		'&:hover:not(:read-only):not(:focus)': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			backgroundColor: backgroundColorHover[appearance],
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			borderColor: borderColorHover[appearance],
			'&:disabled': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
				backgroundColor: disabledRules.backgroundColorHover,
			},
			// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
			'&[data-invalid]': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
				backgroundColor: invalidRules.backgroundColorHover,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
				borderColor: invalidRules.borderColor,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
				boxShadow: `inset 0 0 0 ${token('border.width', '1px')} ${invalidRules.borderColor}`,
			},
		},
	});

const resizeStyle = (resize: string | undefined) => {
	if (resize === 'horizontal' || resize === 'vertical') {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		return css({ resize });
	}
	if (resize === 'auto') {
		return css({ resize: 'both' });
	}
	return css({ resize: 'none' });
};

const borderStyle = (appearance: string | undefined) =>
	css({
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		borderStyle: appearance === 'none' ? 'none' : 'solid',
	});

const fontFamilyStyle = (isMonospaced: boolean | undefined) =>
	css({
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		fontFamily: isMonospaced ? token('font.family.code') : token('font.family.body'),
	});

const borderPaddingAndHeightStyles = (minimumRows = 1, appearance: string | undefined) => {
	const borderWidth = appearance !== 'none' ? 1 : 2;
	const horizontalPaddingWithoutBorderWidth = horizontalPadding - borderWidth;
	const borderHeight = borderWidth;
	return css({
		// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'&[data-compact]': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			minHeight: borderBoxMinHeightCompact(minimumRows, borderHeight),
			// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			padding: `${compactVerticalPadding}px ${horizontalPaddingWithoutBorderWidth}px`,
			// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage, @atlaskit/ui-styling-standard/no-unsafe-values
			lineHeight: lineHeightCompact / 14,
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
		'&:not([data-compact])': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			minHeight: borderBoxMinHeight(minimumRows, borderHeight),
			// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			padding: `${verticalPadding}px ${horizontalPaddingWithoutBorderWidth}px`,
			// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage, @atlaskit/ui-styling-standard/no-unsafe-values
			lineHeight: lineHeightBase / 14,
		},
	});
};

const staticStyles = css({
	display: 'block',
	boxSizing: 'border-box',
	width: '100%',
	minWidth: 0,
	maxWidth: '100%',
	margin: 0,
	position: 'relative',
	flex: '1 1 100%',
	borderRadius: token('border.radius', '3px'),
	// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
	borderWidth: 1,
	font: token('font.body'),
	outline: 'none',
	overflow: 'auto',
	transition: `background-color ${transitionDuration} ease-in-out,
               border-color ${transitionDuration} ease-in-out`,
	wordWrap: 'break-word',
	'&:disabled': {
		cursor: 'not-allowed',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		...overrideSafariDisabledStyles,
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'&::-ms-clear': {
		display: 'none',
	},
	'&:invalid': {
		boxShadow: 'none',
	},
});

// suggestion: these two could be merged into cssMap during @compiled rewrite
const newFontStyles = css({
	font: token('font.body.large'),
	[media.above.xs]: {
		font: token('font.body'),
	},
});
const monospacedFontFamilyStyles = css({
	fontFamily: token('font.family.code'),
	[media.above.xs]: {
		// Reapply the monospaced font family as the font declaration used in the breakpoint in newFontStyles overrides it otherwise
		fontFamily: token('font.family.code'),
	},
});

export const getBaseStyles = ({
	minimumRows,
	resize,
	appearance,
	isMonospaced,
	maxHeight,
}: StyleProps) =>
	// eslint-disable-next-line @repo/internal/styles/no-exported-styles
	css(
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		staticStyles,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		borderPaddingAndHeightStyles(minimumRows, appearance),
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		resizeStyle(resize),
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		borderStyle(appearance),

		// @todo: remove in `platform_design_system_team_safari_input_fix` cleanup
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		fontFamilyStyle(isMonospaced),

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
		fg('platform_design_system_team_safari_input_fix') ? newFontStyles : undefined,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
		isMonospaced && fg('platform_design_system_team_safari_input_fix')
			? monospacedFontFamilyStyles
			: undefined,

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		{ maxHeight },
	);

export const dynamicStyles = (appearance: TextAreaProps['appearance']) =>
	// eslint-disable-next-line @repo/internal/styles/no-exported-styles
	css(
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		bgAndBorderColorStyles(appearance),
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		hoverBackgroundAndBorderStyles(appearance),
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		placeholderStyles,
		{
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			color: componentTokens.textColor,
			'&:disabled': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
				color: disabledRules.textColor,
			},
		},
	);
