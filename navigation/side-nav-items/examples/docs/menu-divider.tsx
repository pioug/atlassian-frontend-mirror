import React from 'react';

import ImageIcon from '@atlaskit/icon/core/image';
import { SideNavBody } from '@atlaskit/navigation-system/layout/side-nav';
import { LinkMenuItem } from '@atlaskit/side-nav-items/link-menu-item';
import { MenuList } from '@atlaskit/side-nav-items/menu-list';
import { Divider } from '@atlaskit/side-nav-items/menu-section';

import { MockSideNav } from './common/mock-side-nav';

const exampleHref = '#example-href';

export const MenuDividerExample = (): React.JSX.Element => (
	<MockSideNav>
		<SideNavBody>
			<MenuList>
				<LinkMenuItem href={exampleHref} elemBefore={<ImageIcon label="" spacing="spacious" />}>
					Link menu item
				</LinkMenuItem>
				<LinkMenuItem href={exampleHref} elemBefore={<ImageIcon label="" spacing="spacious" />}>
					Link menu item
				</LinkMenuItem>
				<Divider />
				<LinkMenuItem href={exampleHref} elemBefore={<ImageIcon label="" spacing="spacious" />}>
					Link menu item
				</LinkMenuItem>
				<LinkMenuItem href={exampleHref} elemBefore={<ImageIcon label="" spacing="spacious" />}>
					Link menu item
				</LinkMenuItem>
			</MenuList>
		</SideNavBody>
	</MockSideNav>
);

export default MenuDividerExample;
