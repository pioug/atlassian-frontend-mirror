import React from 'react';

import { Root } from '@atlaskit/navigation-system/layout/root';
import { SideNav, SideNavContent } from '@atlaskit/navigation-system/layout/side-nav';
import { LinkMenuItem } from '@atlaskit/navigation-system/side-nav-items/link-menu-item';
import { MenuList } from '@atlaskit/navigation-system/side-nav-items/menu-list';
import {
	MenuSection,
	MenuSectionHeading,
} from '@atlaskit/navigation-system/side-nav-items/menu-section';

export const SideNavLayoutExample = () => (
	<Root>
		<SideNav>
			<SideNavContent>
				<MenuList>
					<MenuSection>
						<MenuSectionHeading>Section</MenuSectionHeading>
						<MenuList>
							<LinkMenuItem href="/">Item</LinkMenuItem>
						</MenuList>
					</MenuSection>
				</MenuList>
			</SideNavContent>
		</SideNav>
	</Root>
);
