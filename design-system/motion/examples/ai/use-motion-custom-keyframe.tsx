/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useState } from 'react';

import { keyframes } from '@compiled/react';

import { cssMap, cx, jsx } from '@atlaskit/css';
import ExitingPersistence from '@atlaskit/motion/exiting-persistence';
import { useMotion } from '@atlaskit/motion/use-motion';
import { token } from '@atlaskit/tokens';

const slideIn = keyframes({
	'0%': { transform: 'translateX(-24px)' },
	'100%': { transform: 'translateX(0)' },
});

const slideOut = keyframes({
	'0%': { transform: 'translateX(0)' },
	'100%': { transform: 'translateX(-24px)' },
});

const styles = cssMap({
	entering: {
		animationDuration: token('motion.duration.xxlong'),
		animationTimingFunction: token('motion.easing.out.practical'),
		animationName: `${slideIn}, ${token('motion.keyframe.fade.in')}`,
		animationFillMode: 'backwards',
	},
	exiting: {
		animationDuration: token('motion.duration.xxlong'),
		animationTimingFunction: token('motion.easing.in.practical'),
		animationName: `${slideOut}, ${token('motion.keyframe.fade.out')}`,
		animationFillMode: 'forwards',
	},
});

/**
 * `useMotion` works with custom `@compiled/react` keyframes. The hook exposes the current
 * motion `state`, which the consumer maps to its own keyframe-based styling, applying it
 * directly to the element it renders — no extra wrapper element is created.
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

export default function UseMotionCustomKeyframeExample(): JSX.Element {
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
