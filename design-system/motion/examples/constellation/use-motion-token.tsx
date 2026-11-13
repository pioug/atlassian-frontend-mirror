/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useEffect, useState } from 'react';

import Button from '@atlaskit/button/default/button';
import { cssMap, jsx } from '@atlaskit/css';
import { useMotion } from '@atlaskit/motion/entering/use-motion';
import { Reanimate } from '@atlaskit/motion/reanimate';
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
const AnimatedBlock = ({ isIn }: { isIn: boolean }): JSX.Element => {
	const { ref, reanimate, state } = useMotion<HTMLDivElement>();

	useEffect(() => {
		reanimate(isIn ? Reanimate.enter : Reanimate.exit);
	}, [isIn, reanimate]);

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
					<AnimatedBlock isIn={isIn} />
				</Centered>
			</div>
		</RetryContainer>
	);
};

export default UseMotionTokenExample;
