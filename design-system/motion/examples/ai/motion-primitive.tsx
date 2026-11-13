import React, { useState } from 'react';

import Motion from '@atlaskit/motion/entering/motion';
import { token } from '@atlaskit/tokens';

export default function MotionPrimitiveExample(): JSX.Element {
	const [isVisible, setIsVisible] = useState(true);
	return (
		<>
			<button type="button" onClick={() => setIsVisible((v) => !v)}>
				Toggle
			</button>
			<Motion
				action={isVisible ? 'enter' : 'exit'}
				enteringAnimation={token('motion.modal.enter')}
				exitingAnimation={token('motion.modal.exit')}
			>
				<div>Content</div>
			</Motion>
		</>
	);
}
