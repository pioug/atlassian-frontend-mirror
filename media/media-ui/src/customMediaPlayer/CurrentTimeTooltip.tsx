/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React from 'react';

import { css, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

import type { CurrentTimeTooltipProps } from './CurrentTime';

const currentTimeTooltipStyles = css({
	position: 'absolute',
	userSelect: 'none',
	top: token('space.negative.400'),
	backgroundColor: '#182c4c',
	color: '#eff1f3',
	font: token('font.body.small'),
	paddingTop: token('space.050'),
	paddingRight: token('space.100'),
	paddingBottom: token('space.050'),
	paddingLeft: token('space.100'),
	borderRadius: token('space.050'),
	left: '50%',
	transform: 'translateX(-50%)',
	transition: 'opacity 0.3s',
	wordBreak: 'keep-all',
});

const currentTimeToolTipDraggingStyles = css({
	opacity: 1,
});

const currentTimeToolTipNotDraggingStyles = css({
	opacity: 0,
});

const currentTimeTooltipThumbHoveredStyles = css({
	opacity: 1,
});

const currentTimeTooltipThumbFocusedStyles = css({
	opacity: 1,
});

export const CurrentTimeTooltip = ({
	isDragging,
	timeLineThumbIsHover,
	timeLineThumbIsFocus,
	children,
	...props
}: CurrentTimeTooltipProps &
	React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>): JSX.Element => (
	<div
		css={[
			currentTimeTooltipStyles,
			isDragging && currentTimeToolTipDraggingStyles,
			!isDragging && currentTimeToolTipNotDraggingStyles,
			timeLineThumbIsHover && currentTimeTooltipThumbHoveredStyles,
			timeLineThumbIsFocus && currentTimeTooltipThumbFocusedStyles,
		]}
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		className="current-time-tooltip"
		{...props}
	>
		{children}
	</div>
);
