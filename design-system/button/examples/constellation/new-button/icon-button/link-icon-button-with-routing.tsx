import React from 'react';

import StarFilledIcon from '@atlaskit/icon/glyph/star-filled';

import { LinkIconButton } from '../../../../src/new';

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
