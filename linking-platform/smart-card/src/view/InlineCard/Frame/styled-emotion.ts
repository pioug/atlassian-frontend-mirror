// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from '@emotion/styled';

import { B100, B200, B400, B50, N40 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

export interface WrapperProps {
	href?: string;
	isSelected?: boolean;
	isInteractive?: boolean;
	withoutBackground?: boolean;
	isHovered?: boolean;
	truncateInline?: boolean;
}

const lineHeight = 22;

const selectedStyles = {
	cursor: 'pointer',
	boxShadow: `0 0 0 2px ${token('color.border.selected', B100)}`,
	outline: 'none',
	userSelect: 'none',
	'&, :hover, :focus, :active': {
		textDecoration: 'none',
	},
	'&:hover': {
		border: `1px solid ${token('color.border', N40)}`,
	},
} as const;

const isInteractive = ({ isInteractive }: WrapperProps) => {
	if (isInteractive) {
		return {
			':active': {
				backgroundColor: token('color.background.selected', B50),
			},
			':focus': selectedStyles,
		} as const;
	}

	return undefined;
};

const isSelected = ({ isSelected }: WrapperProps) => {
	if (isSelected) {
		return selectedStyles;
	} else {
		return { userSelect: 'text' } as const;
	}
};

const hoveredStyles = {
	borderColor: token('color.border.accent.blue', B200),
} as const;

const activeHoveredFocusedStyles = (props: WrapperProps) => {
	if (props.withoutBackground) {
		return undefined;
	}

	return { textDecoration: 'none' } as const;
};

const hoveredWihBorderStyles = (props: WrapperProps) =>
	({
		...hoveredStyles,
		...activeHoveredFocusedStyles(props),
	}) as const;

/*
  Inline smart cards should have the following layout:
  ------------------------------------
  | icon | title | action OR lozenge |
  ------------------------------------
  The aim is to ensure (1) all children are
  in line with each other, (2) are vertically
  centered.
*/
// NB: `padding` consistent with @mentions.
// NB: `display: inline` required for `box-decoration-break` to work.
// NB: `box-decoration-break` required for retaining properties (border-radius) on wrap.
const baseWrapperStyles = (props: WrapperProps) =>
	({
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		lineHeight: `${lineHeight}px`,
		padding: `${token('space.025', '2px')} 0px`,
		...(props.withoutBackground
			? { paddingLeft: 0, marginLeft: token('space.negative.025', '-2px') }
			: undefined),
		display: 'inline',
		boxDecorationBreak: 'clone',
		borderRadius: token('border.radius.100', '4px'),
		color: token('color.link', B400),

		...(props.withoutBackground
			? undefined
			: { backgroundColor: token('elevation.surface.raised', 'white') }),

		...isSelected(props),

		...(props.withoutBackground
			? undefined
			: { border: `1px solid ${token('color.border', N40)}` }),

		'&:hover': hoveredStyles,

		'&, :hover, :focus, :active': activeHoveredFocusedStyles(props),

		transition: '0.1s all ease-in-out',
		MozUserSelect: 'none', // -moz-user-select

		...(props.isHovered ? hoveredWihBorderStyles(props) : undefined),
	}) as const;

const truncateStyles = {
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	wordBreak: 'break-all',

	// The height of a truncated card is 1px higher than that of a non-truncated card, so we subtract 1px from the line height.
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
	lineHeight: `${lineHeight - 1}px`,

	display: '-webkit-inline-box',
	WebkitLineClamp: 1,
	WebkitBoxOrient: 'vertical',

	// We need to remove the padding because display: -webkit-inline-box will cause any padding to be
	// added to the total height, causing truncated cards to have greater height than non-truncated cards which use display: inline.
	padding: 0,

	'@supports not (-webkit-line-clamp: 1)': {
		display: 'inline-block',
		maxHeight: `${lineHeight}px`,
		// If the browser does not support webkit, we don't need to remove the padding
		padding: `${token('space.025', '2px')} 0px`,
	},
} as const;

const isTruncated = ({ truncateInline }: WrapperProps) => {
	if (truncateInline) {
		return truncateStyles;
	}

	return undefined;
};

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/ui-styling-standard/no-dynamic-styles -- Ignored via go/DSP-18766
export const WrapperAnchor = styled.a<WrapperProps>((props) => ({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	...baseWrapperStyles(props),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	...isInteractive(props),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	...isTruncated(props),
}));

WrapperAnchor.displayName = 'WrapperAnchor';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/ui-styling-standard/no-dynamic-styles -- Ignored via go/DSP-18766
export const WrapperSpan = styled.span<WrapperProps>((props) => ({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	...baseWrapperStyles(props),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	...isTruncated(props),
}));

WrapperSpan.displayName = 'WrapperSpan';
