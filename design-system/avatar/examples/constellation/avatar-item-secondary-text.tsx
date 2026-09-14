import React from 'react';

import Avatar from '@atlaskit/avatar/avatar';
import AvatarItem from '@atlaskit/avatar/avatar-item';

const AvatarSecondaryTextExample = (): React.JSX.Element => {
	return (
		<AvatarItem
			avatar={<Avatar name="Scott Farquhar" presence="online" />}
			secondaryText="Scott Farquhar"
		/>
	);
};

export default AvatarSecondaryTextExample;
