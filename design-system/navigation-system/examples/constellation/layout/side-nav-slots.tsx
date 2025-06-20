import React from 'react';

import { Root } from '@atlaskit/navigation-system/layout/root';
import {
	SideNav,
	SideNavContent,
	SideNavFooter,
	SideNavHeader,
} from '@atlaskit/navigation-system/layout/side-nav';

export const SideNavSlotsExample = () => (
	<Root>
		<SideNav>
			<SideNavHeader>Header</SideNavHeader>
			<SideNavContent>Content</SideNavContent>
			<SideNavFooter>Footer</SideNavFooter>
		</SideNav>
	</Root>
);
