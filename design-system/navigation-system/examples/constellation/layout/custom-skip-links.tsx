import React from 'react';

import { useSkipLink, useSkipLinkId } from '@atlaskit/navigation-system/layout/skip-links';

export function CustomSkipLinkExample() {
	const id = useSkipLinkId();
	useSkipLink(id, 'Landmark name');

	return <div id={id} />;
}

export default CustomSkipLinkExample;
