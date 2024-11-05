import React from 'react';

import Avatar, { AvatarItem } from '@atlaskit/avatar';

const AvatarItemIsDisabledExample = () => {
	const presence = 'online';
	return (
		<AvatarItem
			isDisabled
			avatar={
				<Avatar
					src="https://pbs.twimg.com/profile_images/803832195970433027/aaoG6PJI_400x400.jpg"
					presence={presence}
					name="Scott Farquhar"
				/>
			}
		/>
	);
};

export default AvatarItemIsDisabledExample;
