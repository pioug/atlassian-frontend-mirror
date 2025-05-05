/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React from 'react';
import { css, jsx } from '@compiled/react';
import { token } from '@atlaskit/tokens';
import { B100, B50, N0, N200, N30, N800 } from '@atlaskit/theme/colors';

const whatsNewResultListItemWrapperStyles = css({
	position: `relative`,
	boxSizing: `border-box`,
	paddingTop: token('space.100', '8px'),
	paddingRight: token('space.100', '8px'),
	paddingBottom: token('space.100', '8px'),
	paddingLeft: token('space.100', '8px'),
	display: `block`,
	textDecoration: `none`,
	cursor: `pointer`,
	color: `${token('color.text.subtlest', N200)}`,
	backgroundColor: `${token('color.background.neutral.subtle', N0)}`,
	borderRadius: `3px`,
	textAlign: `left`,
	'&:hover, &:focus, &:visited, &:active': {
		textDecoration: `none`,
		outline: `none`,
		outlineOffset: `none`,
	},
	'&:focus': {
		boxShadow: `${token('color.border.focused', B100)} 0px 0px 0px 2px inset`,
	},
	'&:hover': {
		backgroundColor: `${token('color.background.neutral.subtle.hovered', N30)}`,
	},

	'&:active': {
		backgroundColor: `${token('color.background.neutral.subtle.pressed', B50)}`,
	},
});

export const WhatsNewResultListItemWrapper = ({
	styles,
	children,
	...rest
}: {
	children: React.ReactNode;
	styles?: React.CSSProperties;
	[rest: string]: any;
}) => (
	// eslint-disable-next-line @atlaskit/design-system/no-html-button, @atlaskit/ui-styling-standard/enforce-style-prop
	<button css={whatsNewResultListItemWrapperStyles} style={styles} {...rest}>
		{children}
	</button>
);

const whatsNewResultListItemTitleContainerStyles = css({
	width: '100%',
	whiteSpace: 'nowrap',
	marginBottom: token('space.050', '4px'),
});

export const WhatsNewResultListItemTitleContainer = ({
	children,
}: {
	children: React.ReactNode;
}) => <div css={whatsNewResultListItemTitleContainerStyles}>{children}</div>;

const whatsNewResultListItemTitleTextStyles = css({
	font: token('font.body.small'),
	display: 'inline-block',
	verticalAlign: 'middle',
	margin: 0,
	paddingLeft: token('space.050', '4px'),
	whiteSpace: 'normal',
	overflowX: 'hidden',
});

export const WhatsNewResultListItemTitleText = ({ children }: { children: React.ReactNode }) => (
	<span css={whatsNewResultListItemTitleTextStyles}>{children}</span>
);

const whatsNewResultListItemDescriptionStyles = css({
	display: 'block',
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
	lineHeight: '20px',
	color: token('color.text', N800),
	margin: 0,
});

export const WhatsNewResultListItemDescription = ({ children }: { children: React.ReactNode }) => (
	// eslint-disable-next-line @atlaskit/design-system/use-primitives-text
	<p css={whatsNewResultListItemDescriptionStyles}>{children}</p>
);
