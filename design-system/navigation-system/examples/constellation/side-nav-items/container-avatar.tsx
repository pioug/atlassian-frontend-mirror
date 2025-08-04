import React from 'react';

import { SideNavContent } from '@atlaskit/navigation-system/layout/side-nav';
import { ContainerAvatar } from '@atlaskit/navigation-system/side-nav-items/container-avatar';
import { LinkMenuItem } from '@atlaskit/navigation-system/side-nav-items/link-menu-item';
import { MenuList } from '@atlaskit/navigation-system/side-nav-items/menu-list';

import MoneyIcon from '../../images/money.svg';
import ScienceIcon from '../../images/science.svg';

import { MockSideNav } from './common/mock-side-nav';

const exampleHref = '#example-href';

export function ContainerAvatarExample() {
	return (
		<MockSideNav>
			<SideNavContent>
				<MenuList>
					<LinkMenuItem href={exampleHref} elemBefore={<ContainerAvatar src={MoneyIcon} />}>
						Link menu item (ContainerAvatar)
					</LinkMenuItem>
					<LinkMenuItem href={exampleHref} elemBefore={<ContainerAvatar src={ScienceIcon} />}>
						Link menu item (ContainerAvatar)
					</LinkMenuItem>
				</MenuList>
			</SideNavContent>
		</MockSideNav>
	);
}

export default ContainerAvatarExample;
