import React from 'react';

import { LinkIconButton } from '@atlaskit/button/new';
import PersonAvatarIcon from '@atlaskit/icon/core/person-avatar';

type MyRouterLinkConfig = {
	to: string;
	replace?: boolean;
};

const LinkIconButtonWithRoutingExample = () => {
	return (
		<LinkIconButton<MyRouterLinkConfig>
			href={{
				to: '/profile',
				replace: true,
			}}
			icon={PersonAvatarIcon}
			label="View profile"
		/>
	);
};

export default LinkIconButtonWithRoutingExample;
