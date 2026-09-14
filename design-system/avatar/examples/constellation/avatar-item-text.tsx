import React from 'react';

import Avatar from '@atlaskit/avatar/avatar';
import AvatarItem from '@atlaskit/avatar/avatar-item';

const AvatarItemTextExample = (): React.JSX.Element => {
	return (
		<AvatarItem
			avatar={<Avatar name="Rovo" appearance="hexagon" presence="online" />}
			primaryText="Rovo Agent"
			secondaryText="rovo@atlassian.com"
		/>
	);
};

export default AvatarItemTextExample;
