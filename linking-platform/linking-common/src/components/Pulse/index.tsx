/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx, keyframes } from '@compiled/react';

import { token } from '@atlaskit/tokens';
import React, { type SyntheticEvent, useRef } from 'react';

const pulseKeyframes = keyframes({
	to: {
		boxShadow: '0 0 0 7px rgba(0, 0, 0, 0)',
	},
});

const pulseStyles = css({
	// eslint-disable-next-line @atlaskit/design-system/no-unsafe-design-token-usage
	borderRadius: token('border.radius.100', '3px'),
	boxShadow: `0 0 0 0 ${token('color.background.discovery.bold', '#5243AA')}`,
	animationName: pulseKeyframes,
	animationDuration: '1.45s',
	animationTimingFunction: 'cubic-bezier(0.5, 0, 0, 1)',
	animationIterationCount: 3,
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
	isInline?: boolean;
}

export const Pulse = ({
	children,
	showPulse = false,
	onAnimationIteration,
	onAnimationStart,
	testId = 'discovery-pulse',
	isInline = false,
}: PulseProps): JSX.Element => {
	// this ref is to persist the animation through rerenders
	const pulseStarted = useRef<boolean>(false);
	if (showPulse) {
		pulseStarted.current = true;
	}

	const stopPropagation = React.useCallback((e: SyntheticEvent) => {
		e.stopPropagation();
	}, []);

	const WrapperTag = isInline ? 'span' : 'div';

	return (
		<WrapperTag
			data-testid={testId}
			css={[commonStyles, pulseStarted.current && pulseStyles]}
			onAnimationIteration={onAnimationIteration}
			onAnimationStart={onAnimationStart}
		>
			<span onAnimationIteration={stopPropagation} onAnimationStart={stopPropagation}>
				{children}
			</span>
		</WrapperTag>
	);
};

export default Pulse;
