/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useEffect, useState } from 'react';

import Button from '@atlaskit/button/default/button';
import { cssMap, jsx } from '@atlaskit/css';
import { useMotion } from '@atlaskit/motion/entering/use-motion';
import { Reanimate } from '@atlaskit/motion/reanimate';
import StaggeredEntrance from '@atlaskit/motion/staggered-entrance';
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
function StatefulBlock({ isVisible }: { isVisible: boolean }): React.JSX.Element {
	const { ref, reanimate, state } = useMotion<HTMLDivElement>({
		initialState: 'hidden',
	});

	useEffect(() => {
		reanimate(isVisible ? Reanimate.enter : Reanimate.exit);
	}, [isVisible, reanimate]);

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
					<StatefulBlock isVisible={isVisible} />
					<StatefulBlock isVisible={isVisible} />
					<StatefulBlock isVisible={isVisible} />
				</StaggeredEntrance>
			</div>
		</React.Fragment>
	);
}
