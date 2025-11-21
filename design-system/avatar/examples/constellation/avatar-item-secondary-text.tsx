import React from 'react';

import Avatar, { AvatarItem } from '@atlaskit/avatar';

const AvatarSecondaryTextExample = (): React.JSX.Element => {
	return (
		<AvatarItem
			avatar={<Avatar name="Scott Farquhar" presence="online" />}
			secondaryText="Scott Farquhar"
		/>
	);
};

export default AvatarSecondaryTextExample;
