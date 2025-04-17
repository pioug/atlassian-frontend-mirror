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
	width: `${PANEL_WIDTH}px`,
	flex: `0 0 ${PANEL_WIDTH}px`,
	position: 'relative',
	overflow: 'hidden',
});

const rightSidePanelDrawerTransitionStyles: { [id: string]: React.CSSProperties } = {
	entered: { width: `${PANEL_WIDTH}px`, flex: `0 0 ${PANEL_WIDTH}px` },
	exited: { width: 0, flex: `0 0 0` },
};

export const RightSidePanelDrawer = ({
	transitionState,
	children,
}: {
	transitionState: TransitionStatus;
	children: React.ReactNode;
}) => (
	<div
		css={rightSidePanelDrawerStyles}
		style={{
			transition: `width ${transitionDurationMs}ms, flex ${transitionDurationMs}ms`,
			width: `0`,
			flex: `0 0 0`,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
			...rightSidePanelDrawerTransitionStyles[transitionState],
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

export const RightSidePanelDrawerContent = ({ children }: { children: React.ReactNode }) => (
	<div css={rightSidePanelDrawerContentStyles}>{children}</div>
);
