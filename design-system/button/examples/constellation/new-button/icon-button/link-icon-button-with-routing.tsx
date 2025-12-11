import React from 'react';

import { LinkIconButton } from '@atlaskit/button/new';
import StarStarredIcon from '@atlaskit/icon/core/star-starred';

type MyRouterLinkConfig = {
	to: string;
	replace?: boolean;
};

const LinkIconButtonExample = (): React.JSX.Element => {
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
