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
	// `init` and `hidden` are the states where the element is mounted but should not be
	// seen. The hook does not style them for you.
	hidden: {
		visibility: 'hidden',
	},
	entering: {
		animation: token('motion.blanket.enter'),
		'@media (prefers-reduced-motion: reduce)': {
			animationName: 'none',
		},
	},
	exiting: {
		animation: token('motion.blanket.exit'),
		'@media (prefers-reduced-motion: reduce)': {
			animationName: 'none',
		},
	},
});

/**
 * A single motion token carries the animation name, duration, and easing, so it can be
 * assigned to the `animation` shorthand for the matching motion state.
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

const UseMotionTokenExample = (): JSX.Element => {
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

export default UseMotionTokenExample;
