import React, { useState } from 'react';

import { cssMap } from '@atlaskit/css';
import { ExitingPersistence, Motion } from '@atlaskit/motion';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	entering: {
		animationName: token('motion.keyframe.fade.in'),
		animationDuration: token('motion.duration.medium'),
		animationTimingFunction: token('motion.easing.out.practical'),
	},
	exiting: {
		animationName: token('motion.keyframe.fade.out'),
		animationDuration: token('motion.duration.medium'),
		animationTimingFunction: token('motion.easing.in.practical'),
	},
});

export default function ExitingPersistenceExample(): JSX.Element {
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
