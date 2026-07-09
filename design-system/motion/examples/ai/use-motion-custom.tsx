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
		animationDuration: token('motion.duration.xlong'),
		animationTimingFunction: token('motion.easing.out.practical'),
		animationName: `${token('motion.keyframe.scale.in.medium')}, ${token('motion.keyframe.fade.in')}`,
		animationFillMode: 'backwards',
	},
	exiting: {
		animationDuration: token('motion.duration.long'),
		animationTimingFunction: token('motion.easing.in.practical'),
		animationName: `${token('motion.keyframe.scale.out.medium')}, ${token('motion.keyframe.fade.out')}`,
		animationFillMode: 'forwards',
	},
});

/**
 * `useMotion` exposes the current motion `state`; the consumer owns its custom animation
 * styling and applies it directly to the element it renders based on that state — no extra
 * wrapper element is created.
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

export default function UseMotionCustomExample(): JSX.Element {
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
