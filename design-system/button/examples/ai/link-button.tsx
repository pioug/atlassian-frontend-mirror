import React from 'react';

import { LinkButton } from '@atlaskit/button/new';

const _default_1: React.JSX.Element[] = [
	<LinkButton href="https://atlassian.com" target="_blank" appearance="subtle">
		External Link
	</LinkButton>,
	// With a Router (requires `<AppProvider routerLinkComponent={Link} />` setup at the root)
	<LinkButton href={{ to: '/about', replace: true }}>About Page</LinkButton>,
];
export default _default_1;
