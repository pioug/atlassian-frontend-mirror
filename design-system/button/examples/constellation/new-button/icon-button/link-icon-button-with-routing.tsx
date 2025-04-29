import React from 'react';

import { LinkIconButton } from '@atlaskit/button/new';
import StarStarredIcon from '@atlaskit/icon/core/migration/star-starred--star-filled';

type MyRouterLinkConfig = {
	to: string;
	replace?: boolean;
};

const LinkIconButtonExample = () => {
	return (
		<LinkIconButton<MyRouterLinkConfig>
			href={{
				to: '/favorites',
				replace: true,
			}}
			icon={StarStarredIcon}
			label="Favorites"
		/>
	);
};

export default LinkIconButtonExample;
