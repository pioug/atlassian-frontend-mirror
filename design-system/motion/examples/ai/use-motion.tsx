/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useState } from 'react';

import { cssMap, cx, jsx } from '@atlaskit/css';
import ExitingPersistence from '@atlaskit/motion/exiting-persistence';
import { useMotion } from '@atlaskit/motion/use-motion';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	entering: {
		animation: token('motion.modal.enter'),
		animationFillMode: 'backwards',
	},
	exiting: {
		animation: token('motion.modal.exit'),
		animationFillMode: 'forwards',
	},
});

/**
 * `useMotion` exposes the current motion `state`; the consumer maps that state to its
 * own styling and applies it directly to the element it renders — no extra wrapper
 * element is created. The returned `ref` must be attached so the exit animation can
 * complete before `ExitingPersistence` removes the element.
 */
function AnimatedItem(): JSX.Element {
	const { state, ref } = useMotion<HTMLDivElement>();

	return (
		<div
			ref={ref}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop, @atlaskit/ui-styling-standard/local-cx-xcss, @compiled/local-cx-xcss
			className={cx(state === 'entering' && styles.entering, state === 'exiting' && styles.exiting)}
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
			<ExitingPersistence appear>{isVisible && <AnimatedItem key="item" />}</ExitingPersistence>
		</React.Fragment>
	);
}
