import React from 'react';

import Avatar from '@atlaskit/avatar/avatar';
import AvatarItem from '@atlaskit/avatar/avatar-item';

const AvatarPrimaryTextExample = (): React.JSX.Element => {
	return (
		<AvatarItem
			avatar={<Avatar name="Mike Cannon-Brookes" presence="online" />}
			primaryText="Mike Cannon-Brookes"
		/>
	);
};

export default AvatarPrimaryTextExample;
