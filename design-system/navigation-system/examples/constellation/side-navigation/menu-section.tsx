import React from 'react';

import AlignTextLeftIcon from '@atlaskit/icon/core/migration/align-text-left--editor-align-left';
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
import { MenuListItem } from '@atlaskit/navigation-system/side-nav-items/menu-list-item';
import {
	Divider,
	MenuSection,
	MenuSectionHeading,
} from '@atlaskit/navigation-system/side-nav-items/menu-section';

import KoalaIcon from '../../images/koala.svg';
import MoneyIcon from '../../images/money.svg';

import { MockSideNav } from './common/mock-side-nav';

export const MenuSectionExample = () => (
	<MockSideNav>
		<SideNavContent>
			<MenuList>
				<ExpandableMenuItem isDefaultExpanded>
					<ExpandableMenuItemTrigger
						elemBefore={
							<ProjectIcon label="" LEGACY_fallbackIcon={IssuesIcon} color="currentColor" />
						}
					>
						Projects
					</ExpandableMenuItemTrigger>
					<ExpandableMenuItemContent>
						<MenuListItem>
							<MenuSection>
								<MenuSectionHeading>Starred</MenuSectionHeading>
								<MenuList>
									<LinkMenuItem href="#" elemBefore={<ContainerAvatar src={MoneyIcon} />}>
										Commerce
									</LinkMenuItem>
								</MenuList>
							</MenuSection>
							<MenuSection>
								<MenuSectionHeading>Recent</MenuSectionHeading>
								<MenuList>
									<LinkMenuItem href="#" elemBefore={<ContainerAvatar src={KoalaIcon} />}>
										Koala-ty assurance
									</LinkMenuItem>
								</MenuList>
								<Divider />
							</MenuSection>
							<LinkMenuItem
								href="#"
								elemBefore={<AlignTextLeftIcon label="" color="currentColor" />}
							>
								View all projects
							</LinkMenuItem>
						</MenuListItem>
					</ExpandableMenuItemContent>
				</ExpandableMenuItem>
			</MenuList>
		</SideNavContent>
	</MockSideNav>
);
