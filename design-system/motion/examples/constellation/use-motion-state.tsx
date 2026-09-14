/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useState } from 'react';

import Button from '@atlaskit/button/new';
import { cssMap, jsx } from '@atlaskit/css';
import ExitingPersistence from '@atlaskit/motion/exiting-persistence';
import StaggeredEntrance from '@atlaskit/motion/staggered-entrance';
import { useMotion } from '@atlaskit/motion/use-motion';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	list: {
		display: 'grid',
		gap: token('space.100'),
		blockSize: '112px',
		marginBlockStart: token('space.200'),
	},
	row: {
		display: 'flex',
		alignItems: 'center',
		gap: token('space.150'),
	},
	block: {
		width: '80px',
		height: '32px',
		backgroundColor: token('color.background.accent.blue.subtle'),
		borderRadius: token('radius.small'),
	},
	stateLabel: {
		color: token('color.text.subtle'),
		font: token('font.body'),
		fontWeight: token('font.weight.medium'),
	},
	// `init` and `hidden` are the two states where the element is mounted but should not be
	// seen. Styling them is the consumer's job.
	hidden: {
		visibility: 'hidden',
	},
	entering: {
		animationName: token('motion.keyframe.fade.in'),
		// A long duration is used here so each state is readable as it passes.
		animationDuration: token('motion.duration.xxlong'),
		animationTimingFunction: token('motion.easing.out.practical'),
		animationFillMode: 'backwards',
		'@media (prefers-reduced-motion: reduce)': {
			animationName: 'none',
		},
	},
	exiting: {
		animationName: token('motion.keyframe.fade.out'),
		animationDuration: token('motion.duration.xxlong'),
		animationTimingFunction: token('motion.easing.in.practical'),
		animationFillMode: 'forwards',
		'@media (prefers-reduced-motion: reduce)': {
			animationName: 'none',
		},
	},
});

/**
 * Renders the animated element alongside a readout of the state `useMotion` currently
 * returns, so the lifecycle can be observed as it runs.
 */
function StatefulBlock(): React.JSX.Element {
	const { ref, state } = useMotion<HTMLDivElement>();

	return (
		<div css={styles.row}>
			<div
				ref={ref}
				css={[
					styles.block,
					(state === 'init' || state === 'hidden') && styles.hidden,
					state === 'entering' && styles.entering,
					state === 'exiting' && styles.exiting,
				]}
			/>
			<span css={styles.stateLabel}>{state}</span>
		</div>
	);
}

export default function UseMotionStateExample(): React.JSX.Element {
	const [isVisible, setIsVisible] = useState(false);

	return (
		<React.Fragment>
			<Button onClick={() => setIsVisible((visible) => !visible)}>
				{isVisible ? 'Animate out' : 'Animate in'}
			</Button>
			<div css={styles.list}>
				<StaggeredEntrance delayStep={500} columns={1}>
					<ExitingPersistence appear>
						{isVisible && (
							<React.Fragment>
								<StatefulBlock key="first" />
								<StatefulBlock key="second" />
								<StatefulBlock key="third" />
							</React.Fragment>
						)}
					</ExitingPersistence>
				</StaggeredEntrance>
			</div>
		</React.Fragment>
	);
}
