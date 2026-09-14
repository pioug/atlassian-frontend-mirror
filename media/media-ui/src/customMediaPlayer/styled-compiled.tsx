/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React, { forwardRef } from 'react';

import { css, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

import { getControlsWrapperClassName } from './getControlsWrapperClassName';

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
