import React, { useState } from 'react';

import Button from '@atlaskit/button/default/button';
import { cssMap } from '@atlaskit/css';
import Heading from '@atlaskit/heading/heading';
import Motion from '@atlaskit/motion/entering/motion';
import ExitingPersistence from '@atlaskit/motion/exiting-persistence';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import { Text } from '@atlaskit/primitives/compiled/text';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	entering: {
		animationDuration: token('motion.duration.xxlong'),
		animationTimingFunction: token('motion.easing.out.practical'),
		animationName: `${token('motion.keyframe.scale.in.medium')}, ${token('motion.keyframe.fade.in')}`,
	},
	exiting: {
		animationDuration: token('motion.duration.xxlong'),
		animationTimingFunction: token('motion.easing.in.practical'),
		animationName: `${token('motion.keyframe.scale.out.medium')}, ${token('motion.keyframe.fade.out')}`,
	},
});

export default (): JSX.Element => {
	const [internalMotionTrigger, setInternalMotionTrigger] = useState<'enter' | 'exit'>('enter');
	const [externalMotionTrigger, setExternalMotionTrigger] = useState<boolean>(true);

	return (
		<Stack space="space.500">
			<Stack>
				<Heading size="medium">Internal</Heading>
				<div>
					<Button
						onClick={() =>
							setInternalMotionTrigger((prev: 'enter' | 'exit') =>
								prev === 'enter' ? 'exit' : 'enter',
							)
						}
					>
						{internalMotionTrigger === 'enter' ? 'Exit' : 'Enter'}
					</Button>
				</div>
				<Motion
					action={internalMotionTrigger}
					enteringAnimationXcss={styles.entering}
					exitingAnimationXcss={styles.exiting}
				>
					<Text>Hello</Text>
				</Motion>
			</Stack>

			<Stack>
				<Heading size="medium">External</Heading>
				<div>
					<Button onClick={() => setExternalMotionTrigger((prev: true | false) => !prev)}>
						{externalMotionTrigger === true ? 'Exit' : 'Enter'}
					</Button>
				</div>
				<ExitingPersistence>
					{externalMotionTrigger && (
						<Motion enteringAnimationXcss={styles.entering} exitingAnimationXcss={styles.exiting}>
							<Text>Hello</Text>
						</Motion>
					)}
				</ExitingPersistence>
			</Stack>
		</Stack>
	);
};
