import React from 'react';

import ProjectIcon from '@atlaskit/icon/core/project';
import IssuesIcon from '@atlaskit/icon/glyph/issues';
import { SideNavContent } from '@atlaskit/navigation-system/layout/side-nav';
import { ContainerAvatar } from '@atlaskit/navigation-system/side-nav-items/container-avatar';
import {
	ExpandableMenuItem,
	ExpandableMenuItemContent,
	ExpandableMenuItemTrigger,
} from '@atlaskit/navigation-system/side-nav-items/expandable-menu-item';
import { LinkMenuItem } from '@atlaskit/navigation-system/side-nav-items/link-menu-item';
import { MenuList } from '@atlaskit/navigation-system/side-nav-items/menu-list';

import KoalaIcon from '../../images/koala.svg';
import MoneyIcon from '../../images/money.svg';

import { MockSideNav } from './common/mock-side-nav';

export const ExpandableMenuItemExample = () => (
	<MockSideNav>
		<SideNavContent>
			<MenuList>
				<ExpandableMenuItem isDefaultExpanded>
					<ExpandableMenuItemTrigger
						elemBefore={
							<ProjectIcon label="" color="currentColor" LEGACY_fallbackIcon={IssuesIcon} />
						}
					>
						Projects
					</ExpandableMenuItemTrigger>
					<ExpandableMenuItemContent>
						<LinkMenuItem href="#" elemBefore={<ContainerAvatar src={MoneyIcon} />}>
							Commerce
						</LinkMenuItem>
						<LinkMenuItem href="#" elemBefore={<ContainerAvatar src={KoalaIcon} />}>
							Koala-ty assurance
						</LinkMenuItem>
					</ExpandableMenuItemContent>
				</ExpandableMenuItem>
			</MenuList>
		</SideNavContent>
	</MockSideNav>
);
