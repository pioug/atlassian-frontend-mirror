/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useRef, useState } from 'react';

import Button from '@atlaskit/button/new';
import { cssMap, jsx } from '@atlaskit/css';
import Heading from '@atlaskit/heading';
import {
	ExitingPersistence,
	Motion,
	type MotionRef,
	Reanimate,
	StaggeredEntrance,
} from '@atlaskit/motion';
import { Box, Inline, Stack } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { Block, RetryContainer } from './utils';

const styles = cssMap({
	box: {
		height: '118px',
		width: '98px',
		paddingBlockStart: token('space.100'),
		paddingInlineEnd: token('space.100'),
		paddingBlockEnd: token('space.100'),
		paddingInlineStart: token('space.100'),
	},
});

export default (): React.JSX.Element => {
	const [isIn, setIsIn] = useState(true);
	const [isPaused, setIsPaused] = useState(true);
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
						<Motion
							enteringAnimation={token('motion.dialog.enter')}
							exitingAnimation={token('motion.dialog.exit')}
						>
							<Block appearance="small" />
						</Motion>
					)}
				</ExitingPersistence>
			</Box>
			<Heading size="medium">Staggered Entrance</Heading>
			<Box xcss={styles.box}>
				<Inline>
					<StaggeredEntrance>
						<ExitingPersistence appear>
							{isIn && (
								<React.Fragment>
									<Motion
										enteringAnimation={token('motion.dialog.enter')}
										exitingAnimation={token('motion.dialog.exit')}
									>
										<Block appearance="small" />
									</Motion>
									<Motion
										enteringAnimation={token('motion.dialog.enter')}
										exitingAnimation={token('motion.dialog.exit')}
									>
										<Block appearance="small" />
									</Motion>
									<Motion
										enteringAnimation={token('motion.dialog.enter')}
										exitingAnimation={token('motion.dialog.exit')}
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
									enteringAnimation={token('motion.dialog.enter')}
									exitingAnimation={token('motion.dialog.exit')}
								>
									<Block appearance="small" />
								</Motion>
							</React.Fragment>
						)}
					</ExitingPersistence>
				</Inline>
			</Box>
			<Heading size="medium">Pausing animations</Heading>
			<Box xcss={styles.box}>
				<Stack space="space.100">
					<Button onClick={() => setIsPaused((val) => !val)}>
						{isPaused ? 'Resume' : 'Pause'}
					</Button>
					<ExitingPersistence appear>
						{isIn && (
							<React.Fragment>
								<Motion
									ref={motionRef}
									enteringAnimation={token('motion.dialog.enter')}
									exitingAnimation={token('motion.dialog.exit')}
									isPaused={isPaused}
								>
									<Block appearance="small" />
								</Motion>
							</React.Fragment>
						)}
					</ExitingPersistence>
				</Stack>
			</Box>
		</RetryContainer>
	);
};
