import React from 'react';

import { LinkIconButton } from '@atlaskit/button/new';
import UserIcon from '@atlaskit/icon/glyph/add';

const LinkIconButtonPrimaryExample = () => {
	return (
		<LinkIconButton
			href="https://atlassian.com"
			icon={UserIcon}
			label="Add new blog"
			appearance="primary"
		/>
	);
};

export default LinkIconButtonPrimaryExample;
