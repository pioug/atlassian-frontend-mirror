/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { forwardRef } from 'react';
import { css, jsx } from '@compiled/react';
import { R300 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import { getControlsWrapperClassName } from './getControlsWrapperClassName';

export interface MutedIndicatorProps {
	isMuted: boolean;
}

export type VolumeWrapperProps = {
	showSlider: boolean;
};

const volumeStyles = css({
	display: 'flex',
	width: '35px',
	overflow: 'hidden',
	transition: 'width 0.3s',
	alignItems: 'center',
	bottom: token('space.0', '0px'),
	left: token('space.500', '40px'),
});

const showSliderVolumeStyles = css({
	'&:hover': {
		width: '150px',
		transition: 'width 0.3s ease-out',
	},
	'&:active': {
		width: '150px',
		transition: 'width 0.3s ease-out',
	},
	'&:focus-within': {
		width: '150px',
		transition: 'width 0.3s ease-out',
	},
});

export const VolumeWrapper = ({
	showSlider,
	children,
	...props
}: VolumeWrapperProps &
	React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>) => (
	<div css={[volumeStyles, showSlider && showSliderVolumeStyles]} {...props}>
		{children}
	</div>
);

const currentTimeStyles = css({
	color: '#c7d1db',
	userSelect: 'none',
	marginRight: token('space.100', '8px'),
	whiteSpace: 'nowrap',
});

export const CurrentTime = ({
	children,
	...props
}: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>) => (
	<div css={currentTimeStyles} {...props}>
		{children}
	</div>
);

const timelineStyles = css({
	width: '100%',
	height: '2px',
	transitionDelay: '1s',
	transition: 'all 0.1s',
	backgroundColor: '#596773',
	borderRadius: '5px',
	position: 'relative',
});

export const TimeLine = forwardRef(
	(
		{
			children,
			...props
		}: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> &
			React.ClassAttributes<HTMLDivElement>,
		ref,
	) => {
		return (
			<div css={timelineStyles} ref={ref as React.RefObject<HTMLDivElement>} {...props}>
				{children}
			</div>
		);
	},
);

const currentTimeLineStyles = css({
	backgroundColor: '#05c',
	borderRadius: 'inherit',
	height: 'inherit',
	position: 'absolute',
	top: token('space.0', '0px'),
	maxWidth: '100%',
});

export const CurrentTimeLine = ({
	children,
	...props
}: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>) => (
	<div css={currentTimeLineStyles} {...props}>
		{children}
	</div>
);

const thumbStyles = css({
	pointerEvents: 'none',
	width: '14px',
	height: '14px',
	borderRadius: '100%',
	backgroundColor: 'white',
	borderWidth: '1px',
	borderStyle: 'solid',
	borderColor: '#666',
	position: 'absolute',
	right: 0,
	top: token('space.025', '2px'),
	transform: 'translate(7px, -50%) scale(0)',
	transition: 'all 0.1s',
	transitionDelay: '1s',
});

export const Thumb = ({
	children,
	...props
}: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>) => (
	<div css={thumbStyles} {...props}>
		{children}
	</div>
);

const currentTimeLineThumbStyles = css({
	position: 'absolute',
	display: 'block',
	right: '0',
	top: '50%',
	transform: 'translate(50%, -50%)',
	backgroundColor: '#05c',
	border: 'none',
	height: token('space.150', '13px'),
	width: token('space.150', '13px'),
	pointerEvents: 'none',
	borderRadius: '100%',
	opacity: '0',
	outline: `2px solid ${token('color.border.focused', '#85B8FF')}`,
	outlineOffset: token('space.025', '2px'),

	'&:focus': {
		opacity: '1',
	},
});
export const CurrentTimeLineThumb = forwardRef(
	(
		{
			children,
			...props
		}: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> &
			React.ClassAttributes<HTMLDivElement>,
		ref,
	) => {
		return (
			<div css={currentTimeLineThumbStyles} ref={ref as React.RefObject<HTMLDivElement>} {...props}>
				{children}
			</div>
		);
	},
);

const bufferedTimeStyles = css({
	backgroundColor: '#8696a7',
	height: 'inherit',
	borderRadius: 'inherit',
	width: 0,
});

export const BufferedTime = ({
	children,
	...props
}: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>) => (
	<div css={bufferedTimeStyles} {...props}>
		{children}
	</div>
);

const leftControlsStyles = css({
	display: 'flex',
	marginLeft: token('space.150', '12px'),
});

export const LeftControls = ({
	children,
	...props
}: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>) => (
	<div css={leftControlsStyles} {...props}>
		{children}
	</div>
);

const rightControlStyles = css({
	display: 'flex',
	alignItems: 'center',
	marginRight: token('space.150', '12px'),
});

export const RightControls = ({
	children,
	...props
}: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>) => (
	<div css={rightControlStyles} {...props}>
		{children}
	</div>
);

type ControlsWrapperProps = {
	controlsHidden: boolean;
};

const controlsWrapperStyles = css({
	bottom: 0,
	left: 0,
	width: '100%',
	height: 'auto',
	background: 'linear-gradient(to top, #101214, rgba(14, 22, 36, 0))',
	position: 'absolute',
});

const hiddenControlsWrapperStyles = css({
	'&:focus-within': {
		opacity: '1',
	},
});

export const ControlsWrapper = forwardRef(
	(
		{
			children,
			controlsHidden,
			...props
		}: ControlsWrapperProps &
			React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> &
			React.ClassAttributes<HTMLDivElement>,
		ref,
	) => {
		return (
			<div
				css={[controlsWrapperStyles, controlsHidden && hiddenControlsWrapperStyles]}
				ref={ref as React.RefObject<HTMLDivElement>}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
				className={getControlsWrapperClassName(controlsHidden)}
				{...props}
			>
				{children}
			</div>
		);
	},
);

const volumeToggleWrapperStyles = css({
	position: 'relative',
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
	marginRight: '13px',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	button: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
		width: '36px !important',
	},
});

const mutedVolumeToggleWrapperStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	button: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
		color: '#EF5C48 !important',
	},
});

export const VolumeToggleWrapper = ({
	isMuted,
	children,
	...props
}: MutedIndicatorProps &
	React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>) => (
	<div css={[volumeToggleWrapperStyles, isMuted && mutedVolumeToggleWrapperStyles]} {...props}>
		{children}
	</div>
);

const volumeTimeRangeWrapperStyles = css({
	width: '100%',
	marginRight: token('space.250', '20px'),
});

export const VolumeTimeRangeWrapper = ({
	children,
	...props
}: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>) => (
	<div css={volumeTimeRangeWrapperStyles} {...props}>
		{children}
	</div>
);

const mutedIndicatorStyles = css({
	width: '29px',
	height: '2px',
	position: 'absolute',
	top: token('space.100', '8px'),
	left: token('space.100', '8px'),
	zIndex: 2,
	background: R300,
	transform: 'rotate(32deg) translateY(10px)',
	opacity: 0,
	pointerEvents: 'none',
});

const isMutedStyles = css({
	opacity: 1,
});

export const MutedIndicator = ({
	isMuted,
	children,
	...props
}: MutedIndicatorProps &
	React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>) => (
	<div css={[mutedIndicatorStyles, isMuted && isMutedStyles]} {...props}>
		{children}
	</div>
);

interface CurrentTimeTooltipProps {
	isDragging: boolean;
	timeLineThumbIsHover: boolean;
	timeLineThumbIsFocus: boolean;
}

const currentTimeTooltipStyles = css({
	position: 'absolute',
	userSelect: 'none',
	top: token('space.negative.400', '-32px'),
	backgroundColor: '#182c4c',
	color: '#eff1f3',
	font: token('font.body.UNSAFE_small'),
	padding: `${token('space.050', '4px')} ${token('space.100', '8px')}`,
	borderRadius: token('space.050', '4px'),
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
	React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>) => (
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

const timeRangeWrapperStyles = css({
	display: 'flex',
	alignItems: 'center',
	height: '22px',
	cursor: 'pointer',
	width: '100%',
	// a11y override default theme colors from '@atlaskit/range' to have better contrast with panel color
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
	'input[type="range"]::-webkit-slider-thumb': {
		'--webkit-appearance': 'none',
		appearance: 'none',
		background: '#9FADBC',
		width: '14px',
		height: '14px',
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
		marginTop: '-5px', // smaller thumb requires adjustment for margin
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
	'input[type="range"]::-webkit-slider-runnable-track': {
		'--webkit-appearance': 'none', // Override default look
		'--track-bg': '#596773',
		'--track-fg': '#9FADBC',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
	'input[type="range"]::-moz-range-progress': {
		backgroundColor: '#9FADBC',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
	'input[type="range"]::-moz-range-track': {
		backgroundColor: '#596773',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
	'input[type="range"]::-moz-range-thumb': {
		background: '#9FADBC',
		width: '14px',
		height: '14px',
	},
});

export const TimeRangeWrapper = forwardRef(
	(
		{
			children,
			...props
		}: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> &
			React.ClassAttributes<HTMLDivElement>,
		ref,
	) => {
		return (
			<div css={timeRangeWrapperStyles} ref={ref as React.RefObject<HTMLDivElement>} {...props}>
				{children}
			</div>
		);
	},
);
