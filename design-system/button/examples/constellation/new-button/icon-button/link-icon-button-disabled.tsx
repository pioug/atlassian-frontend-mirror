import React from 'react';

import EditIcon from '@atlaskit/icon/glyph/edit';

import { LinkIconButton } from '../../../../src/new';

type MyRouterLinkConfig = {
	to: string;
	replace?: boolean;
};

const LinkIconButtonDisabledExample = () => {
	return (
		<LinkIconButton<MyRouterLinkConfig>
			href={{
				to: '/edit',
				replace: true,
			}}
			icon={EditIcon}
			label="Edit"
			isDisabled
		/>
	);
};

export default LinkIconButtonDisabledExample;
