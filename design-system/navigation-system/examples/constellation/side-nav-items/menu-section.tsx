import React from 'react';

import { IconButton } from '@atlaskit/button/new';
import RoadmapsPlanIcon from '@atlaskit/icon-lab/core/roadmaps-plan';
import AddIcon from '@atlaskit/icon/core/add';
import AlignTextLeftIcon from '@atlaskit/icon/core/align-text-left';
import AngleBracketsIcon from '@atlaskit/icon/core/angle-brackets';
import ChartBarIcon from '@atlaskit/icon/core/chart-bar';
import InboxIcon from '@atlaskit/icon/core/inbox';
import MoreIcon from '@atlaskit/icon/core/show-more-horizontal';
import { SideNavContent } from '@atlaskit/navigation-system/layout/side-nav';
import { ContainerAvatar } from '@atlaskit/navigation-system/side-nav-items/container-avatar';
import {
	ExpandableMenuItem,
	ExpandableMenuItemContent,
	ExpandableMenuItemTrigger,
} from '@atlaskit/navigation-system/side-nav-items/expandable-menu-item';
import { LinkMenuItem } from '@atlaskit/navigation-system/side-nav-items/link-menu-item';
import { MenuList } from '@atlaskit/navigation-system/side-nav-items/menu-list';
import {
	MenuSection,
	MenuSectionHeading,
} from '@atlaskit/navigation-system/side-nav-items/menu-section';
import { Inline } from '@atlaskit/primitives/compiled';

import CDIcon from '../../images/cd.svg';
import KoalaIcon from '../../images/koala.svg';
import MoneyIcon from '../../images/money.svg';

import { MockSideNav } from './common/mock-side-nav';

const exampleHref = '#example-href';

function AddAction() {
	return (
		<IconButton
			spacing="compact"
			appearance="subtle"
			label="Add"
			icon={(iconProps) => <AddIcon {...iconProps} size="small" />}
		/>
	);
}

function MoreAction() {
	return (
		<IconButton
			spacing="compact"
			appearance="subtle"
			label="More"
			icon={(iconProps) => <MoreIcon {...iconProps} size="small" />}
		/>
	);
}

export function MenuSectionExample() {
	return (
		<Inline space="space.600">
			<MockSideNav>
				<SideNavContent>
					<MenuList>
						<ExpandableMenuItem isDefaultExpanded>
							<ExpandableMenuItemTrigger
								actions={
									<>
										<AddAction />
										<MoreAction />
									</>
								}
							>
								Projects
							</ExpandableMenuItemTrigger>
							<ExpandableMenuItemContent>
								<MenuSection isMenuListItem>
									<MenuSectionHeading>Starred</MenuSectionHeading>
									<MenuList>
										<LinkMenuItem href={exampleHref} elemBefore={<ContainerAvatar src={CDIcon} />}>
											Mobile app
										</LinkMenuItem>
										<LinkMenuItem
											href={exampleHref}
											elemBefore={<ContainerAvatar src={KoalaIcon} />}
										>
											Online store updates
										</LinkMenuItem>
										<LinkMenuItem
											href={exampleHref}
											elemBefore={<ContainerAvatar src={MoneyIcon} />}
										>
											Finance project
										</LinkMenuItem>
										<LinkMenuItem
											href={exampleHref}
											elemBefore={
												<AlignTextLeftIcon label="" color="currentColor" spacing="spacious" />
											}
										>
											View all projects
										</LinkMenuItem>
									</MenuList>
								</MenuSection>
							</ExpandableMenuItemContent>
						</ExpandableMenuItem>

						<LinkMenuItem
							href={exampleHref}
							elemBefore={<RoadmapsPlanIcon label="" color="currentColor" spacing="spacious" />}
						>
							Plans
						</LinkMenuItem>

						<LinkMenuItem
							href={exampleHref}
							elemBefore={<AngleBracketsIcon label="" color="currentColor" spacing="spacious" />}
						>
							Code
						</LinkMenuItem>
					</MenuList>
				</SideNavContent>
			</MockSideNav>

			<MockSideNav>
				<SideNavContent>
					<MenuList>
						<ExpandableMenuItem isDefaultExpanded>
							<ExpandableMenuItemTrigger>Exp default menu item (level 0)</ExpandableMenuItemTrigger>
							<ExpandableMenuItemContent>
								<MenuSection isMenuListItem>
									<MenuSectionHeading>Menus section heading (Level 1)</MenuSectionHeading>
									<MenuList>
										<ExpandableMenuItem>
											<ExpandableMenuItemTrigger elemBefore={<InboxIcon label="" />}>
												Exp default menu item (level 1)
											</ExpandableMenuItemTrigger>
											<ExpandableMenuItemContent>
												<ExpandableMenuItem>
													<ExpandableMenuItemTrigger elemBefore={<ChartBarIcon label="" />}>
														Exp default menu item (level 2)
													</ExpandableMenuItemTrigger>
													<ExpandableMenuItemContent>
														<LinkMenuItem href={exampleHref}>
															Expandable menu item content
														</LinkMenuItem>
													</ExpandableMenuItemContent>
												</ExpandableMenuItem>
											</ExpandableMenuItemContent>
										</ExpandableMenuItem>

										<ExpandableMenuItem isDefaultExpanded>
											<ExpandableMenuItemTrigger elemBefore={<InboxIcon label="" />}>
												Exp default menu item (level 1)
											</ExpandableMenuItemTrigger>
											<ExpandableMenuItemContent>
												<ExpandableMenuItem>
													<ExpandableMenuItemTrigger elemBefore={<ChartBarIcon label="" />}>
														Exp default menu item (level 2)
													</ExpandableMenuItemTrigger>
													<ExpandableMenuItemContent>
														<LinkMenuItem href={exampleHref}>
															Expandable menu item content
														</LinkMenuItem>
													</ExpandableMenuItemContent>
												</ExpandableMenuItem>
											</ExpandableMenuItemContent>
										</ExpandableMenuItem>
									</MenuList>
								</MenuSection>
							</ExpandableMenuItemContent>
						</ExpandableMenuItem>
					</MenuList>
				</SideNavContent>
			</MockSideNav>
		</Inline>
	);
}

export default MenuSectionExample;
