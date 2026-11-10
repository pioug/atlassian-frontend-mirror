import React, { useState } from 'react';

import Button from '@atlaskit/button/default/button';
import ChevronRightIcon from '@atlaskit/icon/core/chevron-right';
import IconMotion from '@atlaskit/motion/entering/icon-motion';
import { Inline } from '@atlaskit/primitives/compiled/inline';

import IconContainer from './icon-container';

export default function IconMotionRotateChevronExample(): React.JSX.Element {
	const [isRotate, setIsRotate] = useState(false);

	return (
		<Inline space="space.100" alignBlock="center">
			<Button onClick={() => setIsRotate((previous) => !previous)}>Rotate</Button>
			<IconContainer>
				<IconMotion.Rotate isActive={isRotate}>
					<ChevronRightIcon label="" />
				</IconMotion.Rotate>
			</IconContainer>
		</Inline>
	);
}
