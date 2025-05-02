/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React from 'react';
import { css, jsx } from '@compiled/react';
import { token } from '@atlaskit/tokens';
import { N10, N30, N500 } from '@atlaskit/theme/colors';
import { TransitionStatus } from '../constants';

const headerContainerStyles = css({
	backgroundColor: token('color.background.neutral', N10),
	borderBottom: `${token('space.025', '2px')} solid ${token('color.border', N30)}`,
	justifyContent: 'space-between',
	position: 'relative',
});

export const HeaderContainer = ({ children }: { children: React.ReactNode }) => (
	<div css={headerContainerStyles}>{children}</div>
);

const closeButtonContainerStyles = css({
	position: 'absolute',
	right: token('space.100', '8px'),
	top: token('space.150', '12px'),
});

export const CloseButtonContainer = ({ children }: { children: React.ReactNode }) => (
	<div css={closeButtonContainerStyles}>{children}</div>
);

export const TRANSITION_DURATION_MS = 220;

const backButtonContainerStyles = css({
	transition: `left ${TRANSITION_DURATION_MS}ms, opacity ${TRANSITION_DURATION_MS}ms`,
	left: token('space.300', '24px'),
	opacity: 0,
	position: 'absolute',
	top: token('space.150', '12px'),
});

const backButtonContainerTransitionStyles: { [id: string]: React.CSSProperties } = {
	entered: { left: token('space.100', '8px'), opacity: 1 },
	exited: { left: token('space.100', '8px'), opacity: 0 },
};

export const BackButtonContainer = ({
	transitionState,
	children,
}: {
	transitionState: TransitionStatus;
	children: React.ReactNode;
}) => (
	// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
	<div css={backButtonContainerStyles} style={backButtonContainerTransitionStyles[transitionState]}>
		{children}
	</div>
);

const headerTitleStyles = css({
	color: token('color.text.subtle', N500),
	textAlign: 'center',
	font: token('font.body.large'),
	fontWeight: token('font.weight.semibold'),
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
	lineHeight: token('space.800', '56px'),
	width: '100%',
	whiteSpace: 'nowrap',
	textOverflow: 'ellipsis',
	display: 'inline-block',
	overflow: 'hidden',
	verticalAlign: 'middle',
});

export const HeaderTitle = ({ children }: { children: React.ReactNode }) => (
	// eslint-disable-next-line @atlaskit/design-system/use-heading
	<h1 css={headerTitleStyles}>{children}</h1>
);

const headerContentStyles = css({
	paddingTop: 0,
	paddingRight: token('space.200', '16px'),
	paddingBottom: token('space.200', '16px'),
	paddingLeft: token('space.200', '16px'),
});

export const HeaderContent = ({ children }: { children: React.ReactNode }) => (
	<div css={headerContentStyles}>{children}</div>
);
