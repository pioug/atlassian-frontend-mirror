/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

import Button from '@atlaskit/button/new';
import { cssMap, jsx } from '@atlaskit/css';
import ExitingPersistence from '@atlaskit/motion/exiting-persistence';
import { useMotion } from '@atlaskit/motion/use-motion';
import { token } from '@atlaskit/tokens';

import { Block, Centered, RetryContainer } from '../utils';

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
		animationDuration: token('motion.duration.xlong'),
		animationTimingFunction: token('motion.easing.out.practical'),
		// Multiple keyframe tokens can be composed by joining them in `animationName`.
		animationName: `${token('motion.keyframe.scale.in.medium')}, ${token(
			'motion.keyframe.fade.in',
		)}`,
		animationFillMode: 'backwards',
		'@media (prefers-reduced-motion: reduce)': {
			animationName: 'none',
		},
	},
	exiting: {
		animationDuration: token('motion.duration.long'),
		animationTimingFunction: token('motion.easing.in.practical'),
		animationName: `${token('motion.keyframe.scale.out.medium')}, ${token(
			'motion.keyframe.fade.out',
		)}`,
		animationFillMode: 'forwards',
		'@media (prefers-reduced-motion: reduce)': {
			animationName: 'none',
		},
	},
});

/**
 * Building the animation from keyframe, duration, and easing tokens gives full control
 * while keeping the motion consistent with the rest of the design system.
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

const UseMotionCustomExample = (): JSX.Element => {
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

export default UseMotionCustomExample;
