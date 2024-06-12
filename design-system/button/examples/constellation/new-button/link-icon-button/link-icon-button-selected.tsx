import React from 'react';

import BitbucketPullrequestsIcon from '@atlaskit/icon/glyph/bitbucket/pullrequests';

import { LinkIconButton } from '../../../../src/new';

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
