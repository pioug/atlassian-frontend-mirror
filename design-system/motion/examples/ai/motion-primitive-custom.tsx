import React, { useState } from 'react';

import { cssMap } from '@atlaskit/css';
import Motion from '@atlaskit/motion/entering/motion';
import { token } from '@atlaskit/tokens';

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

export default function MotionPrimitiveCustomExample(): JSX.Element {
	const [isVisible, setIsVisible] = useState(true);
	return (
		<>
			<button type="button" onClick={() => setIsVisible((v) => !v)}>
				Toggle
			</button>
			<Motion
				action={isVisible ? 'enter' : 'exit'}
				enteringAnimationXcss={styles.entering}
				exitingAnimationXcss={styles.exiting}
			>
				<div>Content</div>
			</Motion>
		</>
	);
}
