/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React from 'react';
import { css, jsx } from '@compiled/react';
import { token } from '@atlaskit/tokens';

const whatsNewResultListItemWrapperStyles = css({
	position: `relative`,
	boxSizing: `border-box`,
	paddingTop: token('space.100'),
	paddingRight: token('space.100'),
	paddingBottom: token('space.100'),
	paddingLeft: token('space.100'),
	display: `block`,
	textDecoration: `none`,
	cursor: `pointer`,
	color: `${token('color.text.subtlest')}`,
	backgroundColor: `${token('color.background.neutral.subtle')}`,
	borderRadius: `3px`,
	textAlign: `left`,
	'&:hover, &:focus, &:visited, &:active': {
		textDecoration: `none`,
		outline: `none`,
		outlineOffset: `none`,
	},
	'&:focus': {
		boxShadow: `${token('color.border.focused')} 0px 0px 0px 2px inset`,
	},
	'&:hover': {
		backgroundColor: `${token('color.background.neutral.subtle.hovered')}`,
	},

	'&:active': {
		backgroundColor: `${token('color.background.neutral.subtle.pressed')}`,
	},
});

export const WhatsNewResultListItemWrapper = ({
	styles,
	children,
	...rest
}: {
	[rest: string]: any;
	children: React.ReactNode;
	styles?: React.CSSProperties;
}): JSX.Element => (
	// eslint-disable-next-line @atlaskit/design-system/no-html-button, @atlaskit/ui-styling-standard/enforce-style-prop
	<button css={whatsNewResultListItemWrapperStyles} style={styles} {...rest}>
		{children}
	</button>
);

const whatsNewResultListItemTitleContainerStyles = css({
	width: '100%',
	whiteSpace: 'nowrap',
	marginBottom: token('space.050'),
});

export const WhatsNewResultListItemTitleContainer = ({
	children,
}: {
	children: React.ReactNode;
}): JSX.Element => <div css={whatsNewResultListItemTitleContainerStyles}>{children}</div>;

const whatsNewResultListItemTitleTextStyles = css({
	font: token('font.body.small'),
	display: 'inline-block',
	verticalAlign: 'middle',
	margin: 0,
	paddingLeft: token('space.050'),
	whiteSpace: 'normal',
	overflowX: 'hidden',
});

export const WhatsNewResultListItemTitleText = ({
	children,
}: {
	children: React.ReactNode;
}): JSX.Element => <span css={whatsNewResultListItemTitleTextStyles}>{children}</span>;

const whatsNewResultListItemDescriptionStyles = css({
	display: 'block',
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
	lineHeight: '20px',
	color: token('color.text'),
	margin: 0,
});

export const WhatsNewResultListItemDescription = ({
	children,
}: {
	children: React.ReactNode;
}): JSX.Element => (
	// eslint-disable-next-line @atlaskit/design-system/use-primitives-text
	<p css={whatsNewResultListItemDescriptionStyles}>{children}</p>
);
