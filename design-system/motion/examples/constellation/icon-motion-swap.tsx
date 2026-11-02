import React, { useState } from 'react';

import Button from '@atlaskit/button/default/button';
import FlagIcon from '@atlaskit/icon/core/flag';
import HeartIcon from '@atlaskit/icon/core/heart';
import IconMotion from '@atlaskit/motion/entering/icon-motion';
import { Inline } from '@atlaskit/primitives/compiled/inline';
import { token } from '@atlaskit/tokens';

import IconContainer from './icon-container';

export default function IconMotionSwapExample(): React.JSX.Element {
	const [isFlag, setIsFlag] = useState(false);

	return (
		<Inline space="space.100" alignBlock="center">
			<Button onClick={() => setIsFlag((previous) => !previous)}>Change icon</Button>
			<IconContainer>
				<IconMotion
					enteringAnimation={token('motion.iconography.enter.fade')}
					exitingAnimation={token('motion.iconography.exit.fade')}
				>
					{isFlag ? <FlagIcon label="" /> : <HeartIcon label="" />}
				</IconMotion>
			</IconContainer>
		</Inline>
	);
}
