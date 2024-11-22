import React from 'react';

import { LinkIconButton } from '@atlaskit/button/new';
import StarFilledIcon from '@atlaskit/icon/glyph/star-filled';

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
			icon={StarFilledIcon}
			label="Favorites"
		/>
	);
};

export default LinkIconButtonExample;
