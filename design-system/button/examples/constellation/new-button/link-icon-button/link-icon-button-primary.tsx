import React from 'react';

import LinkIconButton from '@atlaskit/button/icon/link';
import AddIcon from '@atlaskit/icon/core/add';

const LinkIconButtonPrimaryExample = (): React.JSX.Element => {
	return (
		<LinkIconButton
			href="https://atlassian.com"
			icon={AddIcon}
			label="Add new blog"
			appearance="primary"
		/>
	);
};

export default LinkIconButtonPrimaryExample;
