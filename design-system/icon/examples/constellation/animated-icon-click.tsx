import React from 'react';

import Button from '@atlaskit/button/default/button';
import AnimatedIconTrigger from '@atlaskit/icon/animated-icon-trigger';
import SignatureAnimatedIcon from '@atlaskit/icon/animated/signature';

const AnimatedIconClickExample = (): React.JSX.Element => {
	return (
		<AnimatedIconTrigger trigger="click">
			<Button iconBefore={(iconProps) => <SignatureAnimatedIcon {...iconProps} />}>Sign</Button>
		</AnimatedIconTrigger>
	);
};

export default AnimatedIconClickExample;
