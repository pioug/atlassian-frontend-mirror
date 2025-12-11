import React from 'react';

import { LinkIconButton } from '@atlaskit/button/new';
import PullRequestIcon from '@atlaskit/icon/core/pull-request';

const LinkIconButtonSelectedExample = (): React.JSX.Element => {
	return (
		<LinkIconButton
			href="https://atlassian.com"
			icon={PullRequestIcon}
			label="View pull requests"
			isSelected
		/>
	);
};

export default LinkIconButtonSelectedExample;
