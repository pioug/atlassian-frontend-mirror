import React from 'react';

import { LinkButton } from '@atlaskit/button/new';

const LinkButtonDangerExample = (): React.JSX.Element => {
	return (
		<LinkButton appearance="danger" href="https://atlassian.com/">
			Danger link button
		</LinkButton>
	);
};

export default LinkButtonDangerExample;
