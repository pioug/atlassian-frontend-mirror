import React, { useState } from 'react';

import { keyframes } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import ExitingPersistence from '@atlaskit/motion/exiting-persistence';
import Motion from '@atlaskit/motion/motion';
import { token } from '@atlaskit/tokens';

const slideIn = keyframes({
	'0%': { transform: 'translateX(-24px)' },
	'100%': { transform: 'translateX(0)' },
});

const slideOut = keyframes({
	'0%': { transform: 'translateX(0)' },
	'100%': { transform: 'translateX(-24px)' },
});

const styles = cssMap({
	entering: {
		animationDuration: token('motion.duration.xxlong'),
		animationTimingFunction: token('motion.easing.out.practical'),
		animationName: `${slideIn}, ${token('motion.keyframe.fade.in')}`,
	},
	exiting: {
		animationDuration: token('motion.duration.xxlong'),
		animationTimingFunction: token('motion.easing.in.practical'),
		animationName: `${slideOut}, ${token('motion.keyframe.fade.out')}`,
	},
});

export default function MotionPrimitiveCustomKeyframeExample(): JSX.Element {
	const [isVisible, setIsVisible] = useState(true);
	return (
		<>
			<button type="button" onClick={() => setIsVisible((v) => !v)}>
				Toggle
			</button>
			<ExitingPersistence appear>
				{isVisible && (
					<Motion
						key="item"
						enteringAnimationXcss={styles.entering}
						exitingAnimationXcss={styles.exiting}
					>
						<div>Content</div>
					</Motion>
				)}
			</ExitingPersistence>
		</>
	);
}
