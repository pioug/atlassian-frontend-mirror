import React from 'react';

import Avatar, { AvatarItem } from '@atlaskit/avatar';

const AvatarItemTextExample = () => {
	return (
		<AvatarItem
			avatar={<Avatar name="Rovo" appearance="hexagon" presence="online" />}
			primaryText="Rovo Agent"
			secondaryText="rovo@atlassian.com"
		/>
	);
};

export default AvatarItemTextExample;
