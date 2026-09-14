import React from 'react';

import Avatar from '@atlaskit/avatar/avatar';
import AvatarItem from '@atlaskit/avatar/avatar-item';

const AvatarItemIsDisabledExample = (): React.JSX.Element => {
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
