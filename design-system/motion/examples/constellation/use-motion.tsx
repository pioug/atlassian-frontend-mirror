/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useState } from 'react';

import Button from '@atlaskit/button/new';
import { cssMap, jsx } from '@atlaskit/css';
import ExitingPersistence from '@atlaskit/motion/exiting-persistence';
import { useMotion } from '@atlaskit/motion/use-motion';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	list: {
		display: 'grid',
		gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
		gap: token('space.100'),
		listStyle: 'none',
		marginBlock: token('space.200'),
		paddingInlineStart: token('space.0'),
	},
	item: {
		backgroundColor: token('color.background.accent.blue.subtle'),
		borderRadius: token('radius.small'),
		paddingBlock: token('space.200'),
		paddingInline: token('space.200'),
	},
	// The `init` and `hidden` states must be styled by the consumer, otherwise the element
	// flashes into view before its entry animation starts, and stays visible after it has
	// animated out.
	hidden: {
		visibility: 'hidden',
	},
	entering: {
		animationName: `${token('motion.keyframe.scale.in.medium')}, ${token(
			'motion.keyframe.fade.in',
		)}`,
		animationDuration: token('motion.duration.xlong'),
		animationTimingFunction: token('motion.easing.out.practical'),
		animationFillMode: 'backwards',
		// The hook settles the state machine immediately under reduced motion, but the
		// animation styles are yours, so you disable them here.
		'@media (prefers-reduced-motion: reduce)': {
			animationName: 'none',
		},
	},
	exiting: {
		animationName: `${token('motion.keyframe.scale.out.medium')}, ${token(
			'motion.keyframe.fade.out',
		)}`,
		animationDuration: token('motion.duration.long'),
		animationTimingFunction: token('motion.easing.in.practical'),
		animationFillMode: 'forwards',
		'@media (prefers-reduced-motion: reduce)': {
			animationName: 'none',
		},
	},
});

function AnimatedListItem(): React.JSX.Element {
	const { ref, state } = useMotion<HTMLLIElement>();

	return (
		<li
			ref={ref}
			css={[
				styles.item,
				(state === 'init' || state === 'hidden') && styles.hidden,
				state === 'entering' && styles.entering,
				state === 'exiting' && styles.exiting,
			]}
		>
			I stay a direct child of the list.
		</li>
	);
}

export default function UseMotionExample(): React.JSX.Element {
	const [isVisible, setIsVisible] = useState(true);

	return (
		<React.Fragment>
			<Button onClick={() => setIsVisible((visible) => !visible)}>
				{isVisible ? 'Remove item' : 'Add item'}
			</Button>
			<ul css={styles.list}>
				<ExitingPersistence appear>
					{isVisible && <AnimatedListItem key="animated-item" />}
				</ExitingPersistence>
			</ul>
		</React.Fragment>
	);
}
