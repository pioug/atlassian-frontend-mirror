/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useEffect, useState } from 'react';

import { cssMap, cx, jsx } from '@atlaskit/css';
import { useMotion } from '@atlaskit/motion/entering/use-motion';
import { Reanimate } from '@atlaskit/motion/reanimate';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	hidden: {
		visibility: 'hidden',
	},
	entering: {
		animation: token('motion.modal.enter'),
		'@media (prefers-reduced-motion: reduce)': {
			animationName: 'none',
		},
	},
	exiting: {
		animation: token('motion.modal.exit'),
		'@media (prefers-reduced-motion: reduce)': {
			animationName: 'none',
		},
	},
});

/**
 * `useMotion` exposes the current motion `state`; the consumer maps that state to its
 * own styling and applies it directly to the element it renders — no extra wrapper
 * element is created. Keep the hook owner mounted and call `reanimate` when application
 * state changes.
 */
function AnimatedItem({ isVisible }: { isVisible: boolean }): JSX.Element {
	const { state, ref, reanimate } = useMotion<HTMLDivElement>();

	useEffect(() => {
		reanimate(isVisible ? Reanimate.enter : Reanimate.exit);
	}, [isVisible, reanimate]);

	return (
		<div
			ref={ref}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop, @atlaskit/ui-styling-standard/local-cx-xcss, @compiled/local-cx-xcss
			className={cx(
				(state === 'init' || state === 'hidden') && styles.hidden,
				state === 'entering' && styles.entering,
				state === 'exiting' && styles.exiting,
			)}
		>
			Content
		</div>
	);
}

export default function UseMotionExample(): JSX.Element {
	const [isVisible, setIsVisible] = useState(true);
	return (
		<React.Fragment>
			<button type="button" onClick={() => setIsVisible((v) => !v)}>
				Toggle
			</button>
			<AnimatedItem isVisible={isVisible} />
		</React.Fragment>
	);
}
