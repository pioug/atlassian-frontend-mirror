/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useRef, useState } from 'react';

import Button from '@atlaskit/button/default/button';
import { cssMap, jsx } from '@atlaskit/css';
import Heading from '@atlaskit/heading/heading';
import Motion, { type MotionRef } from '@atlaskit/motion/entering/motion';
import ExitingPersistence from '@atlaskit/motion/exiting-persistence';
import { Reanimate } from '@atlaskit/motion/reanimate';
import StaggeredEntrance from '@atlaskit/motion/staggered-entrance';
import { Box, Inline, Stack } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { Block } from './utils/blocks';
import { RetryContainer } from './utils/containers';

const styles = cssMap({
	box: {
		height: '118px',
		width: '98px',
		paddingBlockStart: token('space.100'),
		paddingInlineEnd: token('space.100'),
		paddingBlockEnd: token('space.100'),
		paddingInlineStart: token('space.100'),
	},
	entering: {
		animationDuration: token('motion.duration.xxlong'),
		animationTimingFunction: token('motion.easing.out.practical'),
		animationName: `${token('motion.keyframe.scale.in.medium')}, ${token('motion.keyframe.fade.in')}`,
		animationDelay: token('motion.duration.xxlong'),
	},
	exiting: {
		animationDuration: token('motion.duration.xxlong'),
		animationTimingFunction: token('motion.easing.in.practical'),
		animationName: `${token('motion.keyframe.scale.out.medium')}, ${token('motion.keyframe.fade.out')}`,
		animationDelay: token('motion.duration.xxlong'),
	},
});

export default (): React.JSX.Element => {
	const [isIn, setIsIn] = useState(true);
	const motionRef = useRef<MotionRef>(null);

	const handleReanimate = (reanimate: Reanimate): void => {
		motionRef.current?.reanimate(reanimate);
		return;
	};

	return (
		<RetryContainer>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
			<div style={{ textAlign: 'center' }}>
				<Button onClick={() => setIsIn((prev) => !prev)}>{isIn ? 'Exit' : 'Enter'}</Button>
			</div>
			<Heading size="medium">Basic</Heading>
			<Box xcss={styles.box}>
				<ExitingPersistence appear>
					{isIn && (
						<Motion enteringAnimationXcss={styles.entering} exitingAnimationXcss={styles.exiting}>
							<Block appearance="small" />
						</Motion>
					)}
				</ExitingPersistence>
			</Box>
			<Heading size="medium">Staggered Entrance</Heading>
			<Box xcss={styles.box}>
				<Inline>
					<StaggeredEntrance delayStep={100}>
						<ExitingPersistence appear>
							{isIn && (
								<React.Fragment>
									<Motion
										enteringAnimationXcss={styles.entering}
										exitingAnimationXcss={styles.exiting}
									>
										<Block appearance="small" />
									</Motion>
									<Motion
										enteringAnimationXcss={styles.entering}
										exitingAnimationXcss={styles.exiting}
									>
										<Block appearance="small" />
									</Motion>
									<Motion
										enteringAnimationXcss={styles.entering}
										exitingAnimationXcss={styles.exiting}
									>
										<Block appearance="small" />
									</Motion>
								</React.Fragment>
							)}
						</ExitingPersistence>
					</StaggeredEntrance>
				</Inline>
			</Box>
			<Heading size="medium">Trigger reanimation</Heading>
			<Box xcss={styles.box}>
				<Inline>
					<Stack space="space.100">
						<Button onClick={() => handleReanimate(Reanimate.enter)}>Enter</Button>
						<Button onClick={() => handleReanimate(Reanimate.exit_then_enter)}>
							Exit and Enter
						</Button>
					</Stack>
					<ExitingPersistence appear>
						{isIn && (
							<React.Fragment>
								<Motion
									ref={motionRef}
									enteringAnimationXcss={styles.entering}
									exitingAnimationXcss={styles.exiting}
								>
									<Block appearance="small" />
								</Motion>
							</React.Fragment>
						)}
					</ExitingPersistence>
				</Inline>
			</Box>
		</RetryContainer>
	);
};
