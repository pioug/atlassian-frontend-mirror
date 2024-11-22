import React from 'react';

import { LinkIconButton } from '@atlaskit/button/new';
import UserIcon from '@atlaskit/icon/glyph/user-avatar-circle';

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
			icon={UserIcon}
			label="View profile"
		/>
	);
};

export default LinkIconButtonWithRoutingExample;
