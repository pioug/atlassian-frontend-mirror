import React from 'react';

import { LinkButton } from '@atlaskit/button/new';

const LinkButtonDisabledExample = () => {
	return (
		<LinkButton href="https://atlassian.com/" appearance="primary" isDisabled>
			Disabled link button
		</LinkButton>
	);
};

export default LinkButtonDisabledExample;
