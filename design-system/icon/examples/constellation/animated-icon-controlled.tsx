import React, { useState } from 'react';

import Button from '@atlaskit/button/default/button';
import AnimatedIconTrigger from '@atlaskit/icon/animated-icon-trigger';
import AiSearchAnimatedIcon from '@atlaskit/icon/animated/ai-search';

const AnimatedIconControlledExample = (): React.JSX.Element => {
	const [isActive, setIsActive] = useState(false);

	return (
		<AnimatedIconTrigger isActive={isActive} onReset={() => setIsActive(false)}>
			<Button
				iconBefore={(iconProps) => <AiSearchAnimatedIcon {...iconProps} />}
				onClick={() => setIsActive(true)}
			>
				Search with AI
			</Button>
		</AnimatedIconTrigger>
	);
};

export default AnimatedIconControlledExample;
