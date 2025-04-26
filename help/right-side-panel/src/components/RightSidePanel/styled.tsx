/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React from 'react';
import { css, jsx } from '@compiled/react';
import { token } from '@atlaskit/tokens';
import { TransitionStatus } from '.';
import { N30 } from '@atlaskit/theme/colors';

const PANEL_WIDTH = 368;
export const transitionDurationMs = 220;

const rightSidePanelDrawerStyles = css({
	position: 'relative',
	overflow: 'hidden',
});

const rightSidePanelDrawerTransitionStyles = (
	width?: number,
): { [id: string]: React.CSSProperties } => ({
	entered: {
		width: `${width}px`,
		flex: `0 0 ${width}px`,
	},
	exiting: {
		width: 0,
		flex: `0 0 0`,
	},
	exited: {
		width: 0,
		flex: `0 0 0`,
	},
});

export const RightSidePanelDrawer = ({
	transitionState,
	children,
	width = PANEL_WIDTH,
}: {
	transitionState: TransitionStatus;
	children: React.ReactNode;
	width?: number;
}) => (
	<div
		css={rightSidePanelDrawerStyles}
		style={{
			width: `${width}px`,
			flex: `0 0 ${width}px`,
			transition: `width ${0.6 * width}ms, flex ${0.6 * width}ms`,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
			...rightSidePanelDrawerTransitionStyles(width)[transitionState],
		}}
	>
		{children}
	</div>
);

const rightSidePanelDrawerContentStyles = css({
	backgroundColor: token('elevation.surface.overlay', 'white'),
	boxSizing: 'border-box',
	flex: 1,
	borderLeft: `3px solid ${token('color.border', N30)}`,
	overflow: 'hidden',
	flexDirection: 'column',
	width: `${PANEL_WIDTH}px`,
	height: '100%',
	position: 'fixed',
});

export const RightSidePanelDrawerContent = ({
	children,
	width = PANEL_WIDTH,
}: {
	children: React.ReactNode;
	width?: number;
}) => (
	<div
		css={rightSidePanelDrawerContentStyles}
		style={{
			width: `${width}px`,
		}}
	>
		{children}
	</div>
);
