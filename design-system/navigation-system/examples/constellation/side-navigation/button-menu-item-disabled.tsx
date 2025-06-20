import React from 'react';

import CustomizeIcon from '@atlaskit/icon/core/customize';
import { SideNavContent } from '@atlaskit/navigation-system/layout/side-nav';
import { ButtonMenuItem } from '@atlaskit/navigation-system/side-nav-items/button-menu-item';
import { MenuList } from '@atlaskit/navigation-system/side-nav-items/menu-list';

import { MockSideNav } from './common/mock-side-nav';

export const ButtonMenuItemDisabledExample = () => (
	<MockSideNav>
		<SideNavContent>
			<MenuList>
				<ButtonMenuItem elemBefore={<CustomizeIcon label="" color="currentColor" />} isDisabled>
					Customize sidebar
				</ButtonMenuItem>
			</MenuList>
		</SideNavContent>
	</MockSideNav>
);
