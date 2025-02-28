/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React, { forwardRef } from 'react';

import { css, jsx } from '@compiled/react';

import { fg } from '@atlaskit/platform-feature-flags';
import { B100, B200, B400, B50, N40 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

export interface WrapperProps extends React.ComponentProps<any> {
	href?: string;
	isSelected?: boolean;
	isInteractive?: boolean;
	withoutBackground?: boolean;
	isHovered?: boolean;
	truncateInline?: boolean;
}

const lineHeight = 22;

export const WrapperSpan = forwardRef<HTMLSpanElement, WrapperProps>(
	(
		{ truncateInline, withoutBackground, isHovered, isInteractive, isSelected, href, ...props },
		ref,
	) => {
		return (
			<span
				css={[
					fg('platform-linking-visual-refresh-v1') ? baseWrapperStylesNew : baseWrapperStylesOld,
					truncateInline && fg('platform-linking-visual-refresh-v1') && truncateStylesNew,
					truncateInline && !fg('platform-linking-visual-refresh-v1') && truncateStylesOld,
					withoutBackground ? withoutBackgroundStyles : withBackgroundStyles,
					isHovered && hoveredStyles,
					isHovered && !withoutBackground && hoveredWithBackgroundStyles,
					isSelected ? selectedStyles : notSelectedStyle,
				]}
				ref={ref}
				{...props}
			>
				{props.children}
			</span>
		);
	},
);

export const WrapperAnchor = forwardRef<HTMLAnchorElement, WrapperProps>(
	(
		{ truncateInline, withoutBackground, isHovered, isInteractive, isSelected, href, ...props },
		ref,
	) => {
		return (
			// eslint-disable-next-line @atlaskit/design-system/no-html-anchor
			<a
				href={href}
				css={[
					fg('platform-linking-visual-refresh-v1') ? baseWrapperStylesNew : baseWrapperStylesOld,
					truncateInline && fg('platform-linking-visual-refresh-v1') && truncateStylesNew,
					truncateInline && !fg('platform-linking-visual-refresh-v1') && truncateStylesOld,
					withoutBackground ? withoutBackgroundStyles : withBackgroundStyles,
					isHovered && hoveredStyles,
					isHovered && !withoutBackground && hoveredWithBackgroundStyles,
					isSelected ? selectedStyles : notSelectedStyle,
					isInteractive && interactiveStyles,
				]}
				ref={ref}
				{...props}
			>
				{props.children}
			</a>
		);
	},
);

const baseWrapperStylesNew = css({
	font: token('font.body'),
	// TODO (AFB-874): Disabling due to overriding of @compiled/property-shorthand-sorting
	// eslint-disable-next-line @atlaskit/platform/expand-spacing-shorthand
	padding: `${token('space.025')} 0px`,
	display: 'inline',
	boxDecorationBreak: 'clone',
	borderRadius: token('border.radius.100', '4px'),
	color: token('color.link', B400),
	transition: '0.1s all ease-in-out',
	MozUserSelect: 'none', // -moz-user-select
	'&:hover': { borderColor: token('color.border.accent.blue', B200) },
});

const baseWrapperStylesOld = css({
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
	lineHeight: `${lineHeight}px`,
	// TODO (AFB-874): Disabling due to overriding of @compiled/property-shorthand-sorting
	// eslint-disable-next-line @atlaskit/platform/expand-spacing-shorthand
	padding: `${token('space.025')} 0px`,
	display: 'inline',
	boxDecorationBreak: 'clone',
	borderRadius: token('border.radius.100', '4px'),
	color: token('color.link', B400),
	transition: '0.1s all ease-in-out',
	MozUserSelect: 'none', // -moz-user-select
	'&:hover': { borderColor: token('color.border.accent.blue', B200) },
});

// if the parent instruct the wrapper to be interactive, and the wrapper is in focus, apply selectedStyles
const interactiveStyles = css({
	'&:active': {
		backgroundColor: token('color.background.selected', B50),
	},
	'&:focus': {
		cursor: 'pointer',
		boxShadow: `0 0 0 2px ${token('color.border.selected', B100)}`,
		outline: 'none',
		userSelect: 'none',
	},
});

const hoveredStyles = css({
	borderColor: token('color.border.accent.blue', B200),
});

const hoveredWithBackgroundStyles = css({ textDecoration: 'none' });

const withoutBackgroundStyles = css({
	paddingLeft: 0,
	marginLeft: token('space.negative.025', '-2px'),
});
const withBackgroundStyles = css({
	backgroundColor: token('elevation.surface.raised', 'white'),
	border: `1px solid ${token('color.border', N40)}`,
	'&:hover': { textDecoration: 'none' },
	'&:focus': { textDecoration: 'none' },
	'&:active': { textDecoration: 'none' },
});

const truncateStylesNew = css({
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	wordBreak: 'break-all',

	display: '-webkit-inline-box',
	WebkitLineClamp: 1,
	WebkitBoxOrient: 'vertical',

	// We need to remove the padding because display: -webkit-inline-box will cause any padding to be
	// added to the total height, causing truncated cards to have greater height than non-truncated cards which use display: inline.
	padding: 0,

	'@supports not (-webkit-line-clamp: 1)': {
		display: 'inline-block',
		// If the browser does not support webkit, we don't need to remove the padding
		paddingTop: token('space.025'),
		paddingRight: '0px',
		paddingBottom: token('space.025'),
		paddingLeft: '0px',
	},
});

const truncateStylesOld = css({
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
		// eslint-disable-next-line @atlaskit/platform/expand-spacing-shorthand
		padding: `${token('space.025', '2px')} 0px`,
	},
});

const notSelectedStyle = css({ userSelect: 'text' });
const selectedStyles = css({
	cursor: 'pointer',
	boxShadow: `0 0 0 2px ${token('color.border.selected', B100)}`,
	outline: 'none',
	userSelect: 'none',
	'&:focus': {
		textDecoration: 'none',
	},
	'&:active': {
		textDecoration: 'none',
	},
	'&:hover': {
		textDecoration: 'none',
		border: `1px solid ${token('color.border', N40)}`,
	},
});
