/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ReactNode, useState } from 'react';

import { jsx } from '@compiled/react';

import Button from '@atlaskit/button/new';
import { cssMap } from '@atlaskit/css';
import Heading from '@atlaskit/heading';
import { ConfluenceIcon, JiraServiceManagementIcon } from '@atlaskit/logo';
import { ExitingPersistence, Motion } from '@atlaskit/motion';
import { Box, Inline, Stack } from '@atlaskit/primitives/compiled';
import { Radio } from '@atlaskit/radio';
import { token } from '@atlaskit/tokens';

import { Block, RetryContainer } from '../utils';

const styles = cssMap({
	entering: {
		animationDuration: token('motion.duration.xlong'),
		animationTimingFunction: token('motion.easing.out.practical'),
		animationName: `${token('motion.keyframe.scale.in.medium')}, ${token('motion.keyframe.fade.in')}`,
	},
	exiting: {
		animationDuration: token('motion.duration.long'),
		animationTimingFunction: token('motion.easing.in.practical'),
		animationName: `${token('motion.keyframe.scale.out.medium')}, ${token('motion.keyframe.fade.out')}`,
	},
});

const MotionFadeBetweenElements = (): JSX.Element => {
	const [index, setIndex] = useState(0);
	const [appear, setAppear] = useState(true);
	const [exitThenEnter, setExitThenEnter] = useState(false);

	return (
		<RetryContainer>
			<Stack space="space.100">
				<Inline space="space.200">
					<Stack alignBlock="center" space="space.100">
						<Heading size="small">Appear on mount</Heading>
						<Stack space="space.050">
							<Radio label="Animate on mount" isChecked={appear} onChange={() => setAppear(true)} />
							<Radio
								label="Immediately appear on mount"
								isChecked={!appear}
								onChange={() => setAppear(false)}
							/>
						</Stack>
					</Stack>
					<Stack alignBlock="center" space="space.100">
						<Heading size="small">Exit then enter</Heading>
						<Stack space="space.050">
							<Radio
								label="Exit first then enter"
								isChecked={exitThenEnter}
								onChange={() => setExitThenEnter(true)}
							/>
							<Radio
								label="Exit and enter at the same time"
								isChecked={!exitThenEnter}
								onChange={() => setExitThenEnter(false)}
							/>
						</Stack>
					</Stack>
				</Inline>
				<Box>
					<Button onClick={() => setIndex((prev) => (prev + 1) % elements.length)}>Switch</Button>
				</Box>
				<Inline>
					<ExitingPersistence appear={appear} exitThenEnter={exitThenEnter}>
						<div key={index}>{elements[index]}</div>
					</ExitingPersistence>
				</Inline>
			</Stack>
		</RetryContainer>
	);
};

const EnteringBlock = ({ children }: { children: ReactNode }) => (
	<Motion enteringAnimationXcss={styles.entering} exitingAnimationXcss={styles.exiting}>
		<Block>{children}</Block>
	</Motion>
);

const elements = [
	<EnteringBlock>
		<ConfluenceIcon size="xlarge" />
	</EnteringBlock>,
	<EnteringBlock>
		<JiraServiceManagementIcon size="xlarge" />
	</EnteringBlock>,
];

export default MotionFadeBetweenElements;
