/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

import { keyframes } from '@compiled/react';

import Button from '@atlaskit/button/new';
import { cssMap, jsx } from '@atlaskit/css';
import ExitingPersistence from '@atlaskit/motion/exiting-persistence';
import { useMotion } from '@atlaskit/motion/use-motion';
import { token } from '@atlaskit/tokens';

import { Block, Centered, RetryContainer } from '../utils';

const slideIn = keyframes({
	'0%': { transform: 'translateX(-24px)' },
	'100%': { transform: 'translateX(0)' },
});

const slideOut = keyframes({
	'0%': { transform: 'translateX(0)' },
	'100%': { transform: 'translateX(-24px)' },
});

const styles = cssMap({
	container: {
		textAlign: 'center',
	},
	centered: {
		height: '182px',
	},
	hidden: {
		visibility: 'hidden',
	},
	entering: {
		animationDuration: token('motion.duration.xxlong'),
		animationTimingFunction: token('motion.easing.out.practical'),
		// Your own keyframes can be composed with keyframe tokens.
		animationName: `${slideIn}, ${token('motion.keyframe.fade.in')}`,
		animationFillMode: 'backwards',
		'@media (prefers-reduced-motion: reduce)': {
			animationName: 'none',
		},
	},
	exiting: {
		animationDuration: token('motion.duration.xxlong'),
		animationTimingFunction: token('motion.easing.in.practical'),
		animationName: `${slideOut}, ${token('motion.keyframe.fade.out')}`,
		animationFillMode: 'forwards',
		'@media (prefers-reduced-motion: reduce)': {
			animationName: 'none',
		},
	},
});

/**
 * Even with hand-written keyframes, the duration and easing still come from motion
 * tokens so the animation stays in step with the design system.
 */
const AnimatedBlock = (): JSX.Element => {
	const { ref, state } = useMotion<HTMLDivElement>();

	return (
		<Block
			ref={ref}
			css={[
				(state === 'init' || state === 'hidden') && styles.hidden,
				state === 'entering' && styles.entering,
				state === 'exiting' && styles.exiting,
			]}
		/>
	);
};

const UseMotionCustomKeyframeExample = (): JSX.Element => {
	const [isIn, setIsIn] = useState(true);

	return (
		<RetryContainer>
			<div css={styles.container}>
				<Button onClick={() => setIsIn((prev) => !prev)}>{isIn ? 'Exit' : 'Enter'}</Button>

				<Centered css={styles.centered}>
					<ExitingPersistence appear>{isIn && <AnimatedBlock />}</ExitingPersistence>
				</Centered>
			</div>
		</RetryContainer>
	);
};

export default UseMotionCustomKeyframeExample;
