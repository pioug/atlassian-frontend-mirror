import React, { useRef } from 'react';

import Button from '@atlaskit/button/default/button';
import TextReviewAnimatedIcon from '@atlaskit/icon/animated/text-review';
import type { AnimatedIconRef } from '@atlaskit/icon/types';
import { Inline } from '@atlaskit/primitives/compiled/inline';

const AnimatedIconReanimateExample = (): React.JSX.Element => {
	const iconRef = useRef<AnimatedIconRef>(null);

	return (
		<Inline space="space.200" alignBlock="center">
			<TextReviewAnimatedIcon ref={iconRef} label="Review" />
			<Button onClick={() => iconRef.current?.reanimate()}>Play</Button>
		</Inline>
	);
};

export default AnimatedIconReanimateExample;
