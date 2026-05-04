import React, { useState } from 'react';

import { cssMap } from '@atlaskit/css';
import { ExitingPersistence, Motion } from '@atlaskit/motion';
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

export default function MotionExample(): JSX.Element {
	const [isVisible, setIsVisible] = useState(true);
	return (
		<>
			<button type="button" onClick={() => setIsVisible((v) => !v)}>Toggle</button>
			<ExitingPersistence appear>
				{isVisible && (
					<Motion key="item" enteringAnimationXcss={styles.entering} exitingAnimationXcss={styles.exiting}>
						<div>Content</div>
					</Motion>
				)}
			</ExitingPersistence>
		</>
	);
}
