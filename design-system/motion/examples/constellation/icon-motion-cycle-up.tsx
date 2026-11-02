import React, { useRef } from 'react';

import IconButton from '@atlaskit/button/icon/button';
import ArrowUpIcon from '@atlaskit/icon/core/arrow-up';
import IconMotion, { type IconMotionHandle } from '@atlaskit/motion/entering/icon-motion';
import { token } from '@atlaskit/tokens';

export default function IconMotionCycleUpExample(): React.JSX.Element {
	const iconMotionRef = useRef<IconMotionHandle>(null);

	return (
		<IconButton
			icon={(iconProps) => (
				<IconMotion
					ref={iconMotionRef}
					overshoot={iconProps.motionOvershoot}
					enteringAnimation={token('motion.iconography.enter.cycle.up')}
					exitingAnimation={token('motion.iconography.exit.cycle.up')}
					shouldExitThenEnter={false}
				>
					<ArrowUpIcon label={iconProps.label} />
				</IconMotion>
			)}
			label="Send"
			onClick={() => iconMotionRef.current?.reanimate()}
		/>
	);
}
