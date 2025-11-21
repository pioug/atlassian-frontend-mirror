import React from 'react';

import Avatar from '@atlaskit/avatar';

import ExampleImg from '../../examples-util/nucleus.png';

const AvatarXXLargeExample = (): React.JSX.Element => {
	return (
		<div>
			<Avatar
				size="xxlarge"
				src="https://pbs.twimg.com/profile_images/803832195970433027/aaoG6PJI_400x400.jpg"
				name="Scott Farquhar"
			/>
			<Avatar size="xxlarge" appearance="square" src={ExampleImg} name="Nucleus" />
			<Avatar size="xxlarge" appearance="hexagon" src={ExampleImg} name="Nucleus" />
		</div>
	);
};

export default AvatarXXLargeExample;
