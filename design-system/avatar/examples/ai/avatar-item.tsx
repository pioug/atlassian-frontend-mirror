import React from 'react';

import Avatar, { AvatarItem } from '@atlaskit/avatar';

export default [
	<AvatarItem
		avatar={<Avatar name="Bob Wilson" status="approved" />}
		primaryText="Bob Wilson"
		secondaryText="bob.wilson@company.com"
		href="/user/bob-wilson"
	/>,
];
