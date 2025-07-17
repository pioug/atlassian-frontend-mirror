import React, { useCallback } from 'react';

import Button from '@atlaskit/button/new';
import { useExpandSideNav } from '@atlaskit/navigation-system/layout/side-nav';

export function ExpandSideNavButtonExample({ onClick }: { onClick: () => void }) {
	const expandSideNav = useExpandSideNav();

	const handleLaunchSpotlight = useCallback(() => {
		expandSideNav();
		onClick();
	}, [onClick, expandSideNav]);

	return <Button onClick={handleLaunchSpotlight}>Launch spotlight</Button>;
}

export default ExpandSideNavButtonExample;
