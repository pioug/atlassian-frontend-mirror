import React from 'react';

import { LinkIconButton } from '@atlaskit/button/new';
import EditIcon from '@atlaskit/icon/core/edit';

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
