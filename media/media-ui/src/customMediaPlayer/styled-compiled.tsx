/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { forwardRef } from 'react';
import { css, jsx } from '@compiled/react';
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
	bottom: token('space.0'),
	left: token('space.500'),
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
	React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>): JSX.Element => (
	<div css={[volumeStyles, showSlider && showSliderVolumeStyles]} {...props}>
		{children}
	</div>
);

const currentTimeStyles = css({
	color: '#c7d1db',
	userSelect: 'none',
	marginRight: token('space.100'),
	whiteSpace: 'nowrap',
});

export const CurrentTime = ({
	children,
	...props
}: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>): JSX.Element => (
	<div css={currentTimeStyles} {...props}>
		{children}
	</div>
);

const timelineStyles = css({
	width: '100%',
	height: '2px',
	transition: 'all 0.1s',
	transitionDelay: '1s',
	backgroundColor: '#596773',
	borderRadius: token('radius.full'),
	position: 'relative',
});

export const TimeLine: React.ForwardRefExoticComponent<
	Omit<React.ClassAttributes<HTMLDivElement> & React.HTMLAttributes<HTMLDivElement>, 'ref'> &
		React.RefAttributes<unknown>
> = forwardRef(
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
	top: token('space.0'),
	maxWidth: '100%',
});

export const CurrentTimeLine = ({
	children,
	...props
}: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>): JSX.Element => (
	<div css={currentTimeLineStyles} {...props}>
		{children}
	</div>
);

const thumbStyles = css({
	pointerEvents: 'none',
	width: '14px',
	height: '14px',
	borderRadius: token('radius.full'),
	backgroundColor: 'white',
	borderWidth: token('border.width'),
	borderStyle: 'solid',
	borderColor: '#666',
	position: 'absolute',
	right: 0,
	top: token('space.025'),
	transform: 'translate(7px, -50%) scale(0)',
	transition: 'all 0.1s',
	transitionDelay: '1s',
});

export const Thumb = ({
	children,
	...props
}: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>): JSX.Element => (
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
	height: token('space.150'),
	width: token('space.150'),
	pointerEvents: 'none',
	borderRadius: token('radius.full'),
	opacity: '0',
	outline: `${token('border.width.focused')} solid ${token('color.border.focused')}`,
	outlineOffset: token('space.025'),

	'&:focus': {
		opacity: '1',
	},
});
export const CurrentTimeLineThumb: React.ForwardRefExoticComponent<
	Omit<React.ClassAttributes<HTMLDivElement> & React.HTMLAttributes<HTMLDivElement>, 'ref'> &
		React.RefAttributes<unknown>
> = forwardRef(
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
}: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>): JSX.Element => (
	<div css={bufferedTimeStyles} {...props}>
		{children}
	</div>
);

const leftControlsStyles = css({
	display: 'flex',
	marginLeft: token('space.150'),
});

export const LeftControls = ({
	children,
	...props
}: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>): JSX.Element => (
	<div css={leftControlsStyles} {...props}>
		{children}
	</div>
);

const rightControlStyles = css({
	display: 'flex',
	alignItems: 'center',
	marginRight: token('space.150'),
});

export const RightControls = ({
	children,
	...props
}: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>): JSX.Element => (
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

export const ControlsWrapper: React.ForwardRefExoticComponent<
	Omit<
		ControlsWrapperProps &
			React.ClassAttributes<HTMLDivElement> &
			React.HTMLAttributes<HTMLDivElement>,
		'ref'
	> &
		React.RefAttributes<unknown>
> = forwardRef(
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
	React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>): JSX.Element => (
	<div css={[volumeToggleWrapperStyles, isMuted && mutedVolumeToggleWrapperStyles]} {...props}>
		{children}
	</div>
);

const volumeTimeRangeWrapperStyles = css({
	width: '100%',
	marginRight: token('space.250'),
});

export const VolumeTimeRangeWrapper = ({
	children,
	...props
}: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>): JSX.Element => (
	<div css={volumeTimeRangeWrapperStyles} {...props}>
		{children}
	</div>
);

const mutedIndicatorStyles = css({
	width: '29px',
	height: '2px',
	position: 'absolute',
	top: token('space.100'),
	left: token('space.100'),
	zIndex: 2,
	background: '#FF5630',
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
	React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>): JSX.Element => (
	<div css={[mutedIndicatorStyles, isMuted && isMutedStyles]} {...props}>
		{children}
	</div>
);

export interface CurrentTimeTooltipProps {
	isDragging: boolean;
	timeLineThumbIsHover: boolean;
	timeLineThumbIsFocus: boolean;
}

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

export const TimeRangeWrapper: React.ForwardRefExoticComponent<
	Omit<React.ClassAttributes<HTMLDivElement> & React.HTMLAttributes<HTMLDivElement>, 'ref'> &
		React.RefAttributes<unknown>
> = forwardRef(
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
