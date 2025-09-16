import React from 'react';

import { LinkButton } from '@atlaskit/button/new';

export default [
	<LinkButton href="https://atlassian.com" target="_blank" appearance="subtle">
		External Link
	</LinkButton>,
	// With a Router (requires `<AppProvider routerLinkComponent={Link} />` setup at the root)
	<LinkButton href={{ to: '/about', replace: true }}>About Page</LinkButton>,
];
