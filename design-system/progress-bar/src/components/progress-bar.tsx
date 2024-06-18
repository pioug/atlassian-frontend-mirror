/**
 * @jsxRuntime classic
 */
/** @jsx jsx */
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx, keyframes } from '@emotion/react';

import { G300, N40A, N500 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { type DefaultProgressBarProps } from '../types';

const MIN_VALUE = 0;
const MAX_VALUE = 1;

const increasingBarAnimation = keyframes({
	from: { left: '-5%', width: '5%' },
	to: { left: '130%', width: ' 100%' },
});

const decreasingBarAnimation = keyframes({
	from: { left: '-80%', width: '80%' },
	to: { left: '110%', width: '10%' },
});

const containerStyles = css({
	width: `100%`,
	height: 6,
	position: 'relative',
	background: token('color.background.neutral', N40A),
	borderRadius: token('border.radius', '3px'),
	overflow: 'hidden',
});

const containerAppearance = {
	default: css({
		background: token('color.background.neutral', N40A),
	}),
	success: css({
		background: token('color.background.neutral', N40A),
	}),
	inverse: css({
		background: token('color.background.inverse.subtle', 'rgba(255, 255, 255, 0.5)'),
	}),
};

const barAppearance = {
	default: css({
		background: token('color.background.neutral.bold', N500),
	}),
	success: css({
		background: token('color.background.success.bold', G300),
	}),
	inverse: css({
		background: token('elevation.surface', 'white'),
	}),
};

const barStyles = css({
	display: 'block',
	height: 6,
	position: 'absolute',
	borderRadius: token('border.radius', '3px'),
});

const determinateBarStyles = css({
	transition: 'width 0.2s',
});

const increasingBarStyles = css({
	animation: `${increasingBarAnimation} 2s infinite`,
});

const decreasingBarStyles = css({
	animation: `${decreasingBarAnimation} 2s 0.5s infinite`,
});

/**
 * __Progress bar__
 *
 * A progress bar displays the status of a given process.
 *
 * - [Examples](https://atlassian.design/components/progress-bar/examples)
 * - [Code](https://atlassian.design/components/progress-bar/code)
 * - [Usage](https://atlassian.design/components/progress-bar/usage)
 */
const ProgressBar = ({
	appearance = 'default',
	ariaLabel,
	isIndeterminate = false,
	testId = 'progress-bar',
	value = 0,
}: DefaultProgressBarProps) => {
	const valueParsed = isIndeterminate ? MIN_VALUE : Math.max(MIN_VALUE, Math.min(value, MAX_VALUE));

	return (
		<div
			css={[containerStyles, containerAppearance[appearance]]}
			role="progressbar"
			aria-label={ariaLabel}
			aria-valuemin={MIN_VALUE}
			aria-valuenow={valueParsed}
			aria-valuemax={MAX_VALUE}
			tabIndex={0}
			data-testid={testId}
		>
			{isIndeterminate ? (
				<React.Fragment>
					<span css={[barStyles, barAppearance[appearance], increasingBarStyles]} />
					<span css={[barStyles, barAppearance[appearance], decreasingBarStyles]} />
				</React.Fragment>
			) : (
				<span
					style={{ width: `${Number(value) * 100}%` }}
					css={[barStyles, barAppearance[appearance], determinateBarStyles]}
				/>
			)}
		</div>
	);
};

export default ProgressBar;
