/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { forwardRef } from 'react';

import { css, jsx } from '@compiled/react';

import { fg } from '@atlaskit/platform-feature-flags';
import { B100, B200, B400, B50, N40 } from '@atlaskit/theme/colors';
import { expVal } from '@atlaskit/tmp-editor-statsig/expVal';
import { token } from '@atlaskit/tokens';

import type { ViewType } from './index';

export interface WrapperProps extends React.ComponentProps<any> {
	href?: string;
	isHovered?: boolean;
	isInteractive?: boolean;
	isSelected?: boolean;
	truncateInline?: boolean;
	viewType?: ViewType;
	withoutBackground?: boolean;
}

export const WrapperSpan = forwardRef<HTMLSpanElement, WrapperProps>(
	(
		{
			truncateInline,
			withoutBackground,
			isHovered,
			isSelected,
			viewType,
			...props
		},
		ref,
	) => {
		const experimentValue =
			viewType === 'unauthorised'
				? expVal('platform_inline_smartcard_connect_button_exp', 'cohort', 'control')
				: 'control';
		return (
			<span
				css={[
					baseWrapperStyles,
					truncateInline && truncateStyles,
					truncateInline && experimentValue !== 'control' && unauthorisedTruncateStyles,
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
		{
			truncateInline,
			withoutBackground,
			isHovered,
			isInteractive,
			isSelected,
			href,
			viewType,
			...props
		},
		ref,
	) => {
		const experimentValue =
			viewType === 'unauthorised'
				? expVal('platform_inline_smartcard_connect_button_exp', 'cohort', 'control')
				: 'control';

		return (
			// eslint-disable-next-line @atlaskit/design-system/no-html-anchor
			// eslint-disable-next-line @atlaskit/design-system/no-html-anchor
			<a
				href={href}
				css={[
					baseWrapperStyles,
					truncateInline && truncateStyles,
					truncateInline && experimentValue !== 'control' && unauthorisedTruncateStyles,
					withoutBackground ? withoutBackgroundStyles : withBackgroundStyles,
					isHovered && hoveredStyles,
					isHovered && !withoutBackground && hoveredWithBackgroundStyles,
					isSelected ? selectedStyles : notSelectedStyle,
					isInteractive && interactiveStyles,
					viewType === 'errored' && fg('navx-2565-inline-card-error-state-underline') && errorViewTypeStyles,
				]}
				ref={ref}
				{...props}
			>
				{props.children}
			</a>
		);
	},
);

const baseWrapperStyles = css({
	// TODO (AFB-874): Disabling due to overriding of @compiled/property-shorthand-sorting
	// eslint-disable-next-line @atlaskit/platform/expand-spacing-shorthand
	padding: `${token('space.025')} 0px`,
	display: 'inline',
	boxDecorationBreak: 'clone',
	borderRadius: token('radius.small', '4px'),
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

const errorViewTypeStyles = css({
	textDecoration: 'underline',
	'&:hover': { textDecoration: 'none' },
});

const withoutBackgroundStyles = css({
	paddingLeft: 0,
	marginLeft: token('space.negative.025', '-2px'),
});
const withBackgroundStyles = css({
	backgroundColor: token('elevation.surface.raised', 'white'),
	border: `${token('border.width')} solid ${token('color.border', N40)}`,
	'&:hover': { textDecoration: 'none' },
	'&:focus': { textDecoration: 'none' },
	'&:active': { textDecoration: 'none' },
});

const truncateStyles = css({
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

const unauthorisedTruncateStyles = css({
	color: token('color.text.inverse'),
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
		border: `${token('border.width')} solid ${token('color.border', N40)}`,
	},
});
