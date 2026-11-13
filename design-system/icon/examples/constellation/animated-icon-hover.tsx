import React from 'react';

import Button from '@atlaskit/button/default/button';
import AnimatedIconTrigger from '@atlaskit/icon/animated-icon-trigger';
import MagicWandAnimatedIcon from '@atlaskit/icon/animated/magic-wand';

const AnimatedIconHoverExample = (): React.JSX.Element => {
	return (
		<AnimatedIconTrigger>
			<Button iconBefore={(iconProps) => <MagicWandAnimatedIcon {...iconProps} />}>
				Suggest edits
			</Button>
		</AnimatedIconTrigger>
	);
};

export default AnimatedIconHoverExample;
