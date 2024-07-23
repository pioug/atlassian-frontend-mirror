/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx, keyframes } from '@emotion/react';

import { token } from '@atlaskit/tokens';
import { type SyntheticEvent, useRef } from 'react';

const pulseKeyframes = keyframes({
	to: {
		boxShadow: '0 0 0 7px rgba(0, 0, 0, 0)',
	},
});

const pulseStyles = css({
	borderRadius: '3px',
	boxShadow: `0 0 0 0 ${token('color.background.discovery.bold', '#5243AA')}`,
	animation: `${pulseKeyframes} 1.45s cubic-bezier(0.5, 0, 0, 1) 3`,
});

const commonStyles = css({
	display: 'inline',
});

export interface PulseProps {
	children: JSX.Element;
	showPulse?: boolean;
	onAnimationIteration?: React.AnimationEventHandler<HTMLSpanElement>;
	onAnimationStart?: React.AnimationEventHandler<HTMLSpanElement>;
	testId?: string;
}

export const Pulse = ({
	children,
	showPulse = false,
	onAnimationIteration,
	onAnimationStart,
	testId,
}: PulseProps) => {
	// this ref is to persist the animation through rerenders
	const pulseStarted = useRef<boolean>(false);
	if (showPulse) {
		pulseStarted.current = true;
	}

	const stopPropagation = (e: SyntheticEvent) => {
		e.stopPropagation();
	};

	return (
		<div
			data-testid={testId ?? 'discovery-pulse'}
			css={[commonStyles, pulseStarted.current && pulseStyles]}
			onAnimationIteration={onAnimationIteration}
			onAnimationStart={onAnimationStart}
		>
			<span onAnimationIteration={stopPropagation} onAnimationStart={stopPropagation}>
				{children}
			</span>
		</div>
	);
};

export default Pulse;
