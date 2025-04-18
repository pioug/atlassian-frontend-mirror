/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React from 'react';
import { css, jsx } from '@compiled/react';
import { token } from '@atlaskit/tokens';
import { N10, N30 } from '@atlaskit/theme/colors';
import { TransitionStatus } from './constants';

const helpBodyContainerStyles = css({
	flexGrow: 1,
	minHeight: 0,
	position: 'relative',
	overflowY: 'auto',
	overflowX: 'hidden',
	display: 'flex',
	flexDirection: 'column',
	flexWrap: 'nowrap',
	justifyContent: 'space-between',
	alignContent: 'stretch',
	alignItems: 'flex-start',
});

export const HelpBodyContainer = ({ children }: { children: React.ReactNode }) => (
	<div css={helpBodyContainerStyles}>{children}</div>
);

const helpBodyStyles = css({
	width: '100%',
	boxSizing: 'border-box',
	order: 0,
	flex: '1 1 auto',
	alignSelf: 'auto',
	position: 'relative',
	overflowX: 'hidden',
	overflowY: 'auto',
});

export const HelpBody = ({ children }: { children: React.ReactNode }) => (
	<div css={helpBodyStyles}>{children}</div>
);

const helpBodyAiStyles = css({
	width: '100%',
	boxSizing: 'border-box',
	order: 0,
	flex: '1 1 auto',
	alignSelf: 'auto',
	position: 'relative',
});

export const HelpBodyAi = ({ children }: { children: React.ReactNode }) => (
	<div css={helpBodyAiStyles}>{children}</div>
);

type HomeProps = {
	isOverlayFullyVisible?: boolean;
	isOverlayVisible?: boolean;
	children: React.ReactNode;
};

const homeStyles = css({
	display: 'block',
	height: '100%',
	overflow: 'auto',
	paddingTop: token('space.200', '16px'),
	paddingRight: token('space.200', '16px'),
	paddingBottom: token('space.200', '16px'),
	paddingLeft: token('space.200', '16px'),
	boxSizing: 'border-box',
});

export const Home = ({ isOverlayFullyVisible, isOverlayVisible, children }: HomeProps) => (
	<div
		css={homeStyles}
		style={{
			display: isOverlayFullyVisible ? 'none' : 'block',
			overflow: isOverlayVisible ? 'hidden' : 'auto',
		}}
	>
		{children}
	</div>
);

const homeAiStyles = css({
	display: 'block',
	overflow: 'auto',
	paddingLeft: token('space.200', '16px'),
	paddingRight: token('space.200', '16px'),
	paddingBottom: token('space.200', '16px'),
	boxSizing: 'border-box',
});

export const HomeAi = ({ isOverlayFullyVisible, isOverlayVisible, children }: HomeProps) => (
	<div
		css={homeAiStyles}
		style={{
			display: isOverlayFullyVisible ? 'none' : 'block',
			overflow: isOverlayVisible ? 'hidden' : 'auto',
		}}
	>
		{children}
	</div>
);

const helpFooterStyles = css({
	paddingTop: token('space.100', '8px'),
	paddingRight: 0,
	paddingBottom: token('space.100', '8px'),
	paddingLeft: 0,
	boxSizing: 'border-box',
	width: '100%',
	backgroundColor: token('color.background.neutral', N10),
	borderTop: `${token('space.025', '2px')} solid ${token('color.border', N30)}`,
	justifyContent: 'space-between',
});

export const HelpFooter = ({
	children,
	...rest
}: {
	children: React.ReactNode;
	[rest: string]: any;
}) => (
	<div css={helpFooterStyles} {...rest}>
		{children}
	</div>
);

export const BACK_BUTTON_CONTAINER_TRANSITION_DURATION_MS = 220;

const backButtonContainerStyles = css({
	transition: `left ${BACK_BUTTON_CONTAINER_TRANSITION_DURATION_MS}ms, opacity ${BACK_BUTTON_CONTAINER_TRANSITION_DURATION_MS}ms`,
	position: 'absolute',
	marginTop: token('space.200', '14px'),
	left: token('space.300', '24px'),
	height: token('space.400', '32px'),
	opacity: 0,
});

const backButtonContainerTransitionStyles: {
	[id: string]: React.CSSProperties;
} = {
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
	<div
		css={backButtonContainerStyles}
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
		style={backButtonContainerTransitionStyles[transitionState]}
	>
		{children}
	</div>
);
