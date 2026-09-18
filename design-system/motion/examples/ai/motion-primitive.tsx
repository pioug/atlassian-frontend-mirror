import React, { useState } from 'react';

import Motion from '@atlaskit/motion/entering/motion';
import ExitingPersistence from '@atlaskit/motion/exiting-persistence';
import { token } from '@atlaskit/tokens';

export default function MotionPrimitiveExample(): JSX.Element {
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
						enteringAnimation={token('motion.modal.enter')}
						exitingAnimation={token('motion.modal.exit')}
					>
						<div>Content</div>
					</Motion>
				)}
			</ExitingPersistence>
		</>
	);
}
