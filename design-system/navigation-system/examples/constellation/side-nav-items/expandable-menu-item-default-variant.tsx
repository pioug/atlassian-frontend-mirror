import React from 'react';

import { IconButton } from '@atlaskit/button/new';
import AddIcon from '@atlaskit/icon/core/add';
import ChartBarIcon from '@atlaskit/icon/core/chart-bar';
import HomeIcon from '@atlaskit/icon/core/home';
import InboxIcon from '@atlaskit/icon/core/inbox';
import MoreIcon from '@atlaskit/icon/core/show-more-horizontal';
import Lozenge from '@atlaskit/lozenge';
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
import { JiraIcon } from '@atlaskit/temp-nav-app-icons/jira';

import MoneyIcon from '../../images/money.svg';

import { MockSideNav } from './common/mock-side-nav';

const exampleHref = '#example-href';

function PlaceholderExpandableContent() {
	return (
		<ExpandableMenuItemContent>
			<LinkMenuItem href={exampleHref}>Expandable menu item content</LinkMenuItem>
		</ExpandableMenuItemContent>
	);
}

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

// Examples of the default (button) variant of the expandable menu item.
// This means there is no href provided.
export function ExpandableMenuItemDefaultVariantExample() {
	return (
		<Inline space="space.600">
			<MockSideNav>
				<SideNavContent>
					<MenuList>
						<ExpandableMenuItem>
							<ExpandableMenuItemTrigger>Exp default menu item (default)</ExpandableMenuItemTrigger>
							<PlaceholderExpandableContent />
						</ExpandableMenuItem>

						<ExpandableMenuItem>
							<ExpandableMenuItemTrigger
								elemBefore={<HomeIcon label="" color="currentColor" spacing="spacious" />}
							>
								Exp default menu item (icon)
							</ExpandableMenuItemTrigger>
							<PlaceholderExpandableContent />
						</ExpandableMenuItem>

						<ExpandableMenuItem>
							<ExpandableMenuItemTrigger elemBefore={<ContainerAvatar src={MoneyIcon} />}>
								Exp default menu item (ContainerAvatar)
							</ExpandableMenuItemTrigger>
							<PlaceholderExpandableContent />
						</ExpandableMenuItem>

						<ExpandableMenuItem>
							<ExpandableMenuItemTrigger elemBefore={<JiraIcon label="" />}>
								Exp default menu item (app tile)
							</ExpandableMenuItemTrigger>
							<PlaceholderExpandableContent />
						</ExpandableMenuItem>

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

			<MockSideNav>
				<SideNavContent>
					<MenuList>
						<ExpandableMenuItem>
							<ExpandableMenuItemTrigger
								elemBefore={<HomeIcon label="" color="currentColor" spacing="spacious" />}
								actions={
									<>
										<AddAction />
										<MoreAction />
									</>
								}
							>
								Exp default menu item (actions)
							</ExpandableMenuItemTrigger>
							<PlaceholderExpandableContent />
						</ExpandableMenuItem>

						<ExpandableMenuItem>
							<ExpandableMenuItemTrigger
								elemBefore={<HomeIcon label="" color="currentColor" spacing="spacious" />}
								actionsOnHover={
									<>
										<AddAction />
										<MoreAction />
									</>
								}
							>
								Exp default menu item (actionsOnHover)
							</ExpandableMenuItemTrigger>
							<PlaceholderExpandableContent />
						</ExpandableMenuItem>

						<ExpandableMenuItem>
							<ExpandableMenuItemTrigger
								elemBefore={<HomeIcon label="" color="currentColor" spacing="spacious" />}
								actions={<MoreAction />}
								actionsOnHover={<AddAction />}
							>
								Exp default menu item (actions & actionsOnHover)
							</ExpandableMenuItemTrigger>
							<PlaceholderExpandableContent />
						</ExpandableMenuItem>

						<ExpandableMenuItem>
							<ExpandableMenuItemTrigger
								elemBefore={<HomeIcon label="" color="currentColor" spacing="spacious" />}
								elemAfter={<Lozenge>New</Lozenge>}
							>
								Exp default menu item (elemAfter)
							</ExpandableMenuItemTrigger>
							<PlaceholderExpandableContent />
						</ExpandableMenuItem>

						<ExpandableMenuItem>
							<ExpandableMenuItemTrigger
								elemBefore={<HomeIcon label="" color="currentColor" spacing="spacious" />}
								elemAfter={<Lozenge>New</Lozenge>}
								actions={<MoreAction />}
								actionsOnHover={<AddAction />}
							>
								Exp default menu item (elemAfter, actions & actionsOnHover)
							</ExpandableMenuItemTrigger>
							<PlaceholderExpandableContent />
						</ExpandableMenuItem>
					</MenuList>
				</SideNavContent>
			</MockSideNav>
		</Inline>
	);
}

export default ExpandableMenuItemDefaultVariantExample;
