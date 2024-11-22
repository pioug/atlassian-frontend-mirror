import React from 'react';

import { LinkIconButton } from '@atlaskit/button/new';
import BitbucketPullrequestsIcon from '@atlaskit/icon/glyph/bitbucket/pullrequests';

const LinkIconButtonSelectedExample = () => {
	return (
		<LinkIconButton
			href="https://atlassian.com"
			icon={BitbucketPullrequestsIcon}
			label="View pull requests"
			isSelected
		/>
	);
};

export default LinkIconButtonSelectedExample;
