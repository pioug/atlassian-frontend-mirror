import React from 'react';

import Avatar, { AvatarItem } from '../../src';

const AvatarItemTextExample = () => {
	return (
		<AvatarItem
			avatar={<Avatar name="Atlassian CEO" presence="online" />}
			primaryText="Atlassian CEO"
			secondaryText="CEO@atlassian.com"
		/>
	);
};

export default AvatarItemTextExample;
