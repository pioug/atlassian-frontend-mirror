/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React from 'react';
import { css, jsx } from '@compiled/react';
import { token } from '@atlaskit/tokens';

const needMoreHelpContainerStyles = css({
	zIndex: 11,
	alignSelf: 'center',
	alignContent: 'center',
	backgroundColor: token('color.background.accent.yellow.subtlest'),
	width: '187px',
	height: token('space.500', '42px'),
	boxShadow: token(
		'elevation.shadow.overlay',
		'0px 0px 0px 1px var(--shadow-overlay-third,rgba(188,214,240,0.00)) inset',
	),
	filter:
		'drop-shadow(0px 8px 12px var(--shadow-overlay-second, rgba(9,30,66,0.15))) drop-shadow(0px 0px 1px rgba(9,30,66,0.31))',
});

export const NeedMoreHelpContainer = ({ children }: { children: React.ReactNode }) => (
	<div css={needMoreHelpContainerStyles}>{children}</div>
);

const needMoreHelpContentStyles = css({
	color: token('color.text'),
	font: token('font.heading.xxsmall'),
	display: 'inline-block',
	alignSelf: 'center',
	margin: 0,
});

export const NeedMoreHelpContent = ({ children }: { children: React.ReactNode }) => (
	// eslint-disable-next-line @atlaskit/design-system/use-primitives-text
	<p css={needMoreHelpContentStyles}>{children}</p>
);

const helpAskAIStyles = css({
	color: token('color.text.selected'),
	font: token('font.heading.xxsmall'),
	display: 'inline-block',
	alignSelf: 'center',
	margin: 0,
	cursor: 'pointer',
	'&:hover': {
		textDecoration: 'underline',
	},
});

export const HelpAskAI = ({
	children,
	onClick,
}: {
	children: React.ReactNode;
	onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}) => (
	// eslint-disable-next-line @atlaskit/design-system/use-primitives-text, jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions, @atlassian/a11y/no-noninteractive-element-interactions
	<p css={helpAskAIStyles} onClick={onClick}>
		{children}
	</p>
);
