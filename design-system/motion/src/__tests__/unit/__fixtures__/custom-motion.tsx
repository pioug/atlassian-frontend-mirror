import React from 'react';

import { cssMap } from '@atlaskit/css';
import Motion, { type MotionProps } from '@atlaskit/motion/entering/motion';
import { token } from '@atlaskit/tokens';

const customAnimation = cssMap({
	entering: {
		animationDuration: token('motion.duration.long'),
		animationTimingFunction: token('motion.easing.inout.bold'),
		animationName: token('motion.keyframe.fade.in'),
		animationDelay: token('motion.duration.medium'),
	},
	exiting: {
		animationDuration: token('motion.duration.medium'),
		animationTimingFunction: token('motion.easing.inout.bold'),
		animationName: token('motion.keyframe.fade.out'),
		animationDelay: token('motion.duration.short'),
	},
});

interface CustomMotionExampleProps {
	children: React.ReactNode;
	onFinish?: MotionProps['onFinish'];
	testId?: string;
}

/**
 * __Custom motion example__
 *
 * A custom motion example
 */
export const CustomMotionExample = (props: CustomMotionExampleProps): React.JSX.Element => (
	<Motion
		enteringAnimationXcss={customAnimation.entering}
		exitingAnimationXcss={customAnimation.exiting}
		onFinish={props.onFinish}
		testId={props.testId}
	>
		<div />
	</Motion>
);
