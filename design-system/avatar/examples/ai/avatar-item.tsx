import React from 'react';

import Avatar from '@atlaskit/avatar/avatar';
import AvatarItem from '@atlaskit/avatar/avatar-item';

const Example = (): React.JSX.Element => (
	<AvatarItem
		avatar={<Avatar name="Bob Wilson" status="approved" />}
		primaryText="Bob Wilson"
		secondaryText="bob.wilson@company.com"
		href="/user/bob-wilson"
	/>
);
export default Example;
