import React from 'react';

import { IconButton } from '@atlaskit/button/new';
import AddIcon from '@atlaskit/icon/core/add';
import ChartBarIcon from '@atlaskit/icon/core/chart-bar';
import ClockIcon from '@atlaskit/icon/core/clock';
import HomeIcon from '@atlaskit/icon/core/home';
import InboxIcon from '@atlaskit/icon/core/inbox';
import MoreIcon from '@atlaskit/icon/core/show-more-horizontal';
import Lozenge from '@atlaskit/lozenge';
import { SideNavContent } from '@atlaskit/navigation-system/layout/side-nav';
import {
	ExpandableMenuItem,
	ExpandableMenuItemContent,
	ExpandableMenuItemTrigger,
} from '@atlaskit/navigation-system/side-nav-items/expandable-menu-item';
import {
	FlyoutMenuItem,
	FlyoutMenuItemTrigger,
} from '@atlaskit/navigation-system/side-nav-items/flyout-menu-item';
import { LinkMenuItem } from '@atlaskit/navigation-system/side-nav-items/link-menu-item';
import { MenuList } from '@atlaskit/navigation-system/side-nav-items/menu-list';
import {
	MenuSection,
	MenuSectionHeading,
} from '@atlaskit/navigation-system/side-nav-items/menu-section';

import { MockSideNav } from './common/mock-side-nav';

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

const exampleHref = '#example-href';

export function RightToLeftExample() {
	return (
		<div dir="rtl">
			<MockSideNav>
				<SideNavContent>
					<MenuList>
						<LinkMenuItem
							href={exampleHref}
							elemBefore={<HomeIcon label="" color="currentColor" spacing="spacious" />}
							elemAfter={<Lozenge>New</Lozenge>}
						>
							Link menu item (elemAfter)
						</LinkMenuItem>
						<LinkMenuItem
							href={exampleHref}
							elemBefore={<HomeIcon label="" color="currentColor" spacing="spacious" />}
							actions={<MoreAction />}
							actionsOnHover={<AddAction />}
						>
							Link menu item (actions & actionsOnHover)
						</LinkMenuItem>

						<LinkMenuItem
							href={exampleHref}
							elemBefore={<HomeIcon label="" color="currentColor" spacing="spacious" />}
							elemAfter={<Lozenge>New</Lozenge>}
							actions={<MoreAction />}
							actionsOnHover={<AddAction />}
						>
							Link menu item (elemAfter, actions & actionsOnHover)
						</LinkMenuItem>

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

						<FlyoutMenuItem>
							<FlyoutMenuItemTrigger elemBefore={<ClockIcon label="" color="currentColor" />}>
								Flyout menu item (icon)
							</FlyoutMenuItemTrigger>
						</FlyoutMenuItem>
					</MenuList>
				</SideNavContent>
			</MockSideNav>
		</div>
	);
}

export default RightToLeftExample;
