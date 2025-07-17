/**
 * @jsxfrag
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useState } from 'react';

import { IconButton } from '@atlaskit/button/new';
import { cssMap, jsx } from '@atlaskit/css';
import AddIcon from '@atlaskit/icon/core/add';
import ChartBarIcon from '@atlaskit/icon/core/chart-bar';
import InboxIcon from '@atlaskit/icon/core/inbox';
import HomeIcon from '@atlaskit/icon/core/migration/home';
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

function PlaceholderExpandableContent() {
	return (
		<ExpandableMenuItemContent>
			<LinkMenuItem href="#">Expandable menu item content</LinkMenuItem>
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

const mockSideNavStyles = cssMap({
	root: {
		width: '300px',
	},
});

// Examples of the link variant of the expandable menu item.
// This means there is an href provided.
export function ExpandableMenuItemLinkVariantExample() {
	const [isMenuItemSelected, setIsMenuItemSelected] = useState(false);

	return (
		<Inline spread="space-between">
			<div css={mockSideNavStyles.root}>
				<SideNavContent>
					<MenuList>
						<ExpandableMenuItem>
							<ExpandableMenuItemTrigger href="#">
								Exp link menu item (default)
							</ExpandableMenuItemTrigger>
							<PlaceholderExpandableContent />
						</ExpandableMenuItem>

						<ExpandableMenuItem>
							<ExpandableMenuItemTrigger
								href="#"
								elemBefore={<HomeIcon label="" color="currentColor" spacing="spacious" />}
							>
								Exp link menu item (icon)
							</ExpandableMenuItemTrigger>
							<PlaceholderExpandableContent />
						</ExpandableMenuItem>

						<ExpandableMenuItem>
							<ExpandableMenuItemTrigger href="#" elemBefore={<ContainerAvatar src={MoneyIcon} />}>
								Exp link menu item (ContainerAvatar)
							</ExpandableMenuItemTrigger>
							<PlaceholderExpandableContent />
						</ExpandableMenuItem>

						<ExpandableMenuItem>
							<ExpandableMenuItemTrigger href="#" elemBefore={<JiraIcon label="" />}>
								Exp link menu item (app tile)
							</ExpandableMenuItemTrigger>
							<PlaceholderExpandableContent />
						</ExpandableMenuItem>

						<ExpandableMenuItem isDefaultExpanded>
							<ExpandableMenuItemTrigger href="#">
								Exp link menu item (level 0)
							</ExpandableMenuItemTrigger>
							<ExpandableMenuItemContent>
								<MenuSection isMenuListItem>
									<MenuSectionHeading>Menus section heading (Level 1)</MenuSectionHeading>
									<MenuList>
										<ExpandableMenuItem>
											<ExpandableMenuItemTrigger href="#" elemBefore={<InboxIcon label="" />}>
												Exp link menu item (level 1)
											</ExpandableMenuItemTrigger>
											<ExpandableMenuItemContent>
												<ExpandableMenuItem>
													<ExpandableMenuItemTrigger
														href="#"
														elemBefore={<ChartBarIcon label="" />}
													>
														Exp link menu item (level 2)
													</ExpandableMenuItemTrigger>
													<ExpandableMenuItemContent>
														<LinkMenuItem href="#">Expandable menu item content</LinkMenuItem>
													</ExpandableMenuItemContent>
												</ExpandableMenuItem>
											</ExpandableMenuItemContent>
										</ExpandableMenuItem>

										<ExpandableMenuItem isDefaultExpanded>
											<ExpandableMenuItemTrigger href="#" elemBefore={<InboxIcon label="" />}>
												Exp link menu item (level 1)
											</ExpandableMenuItemTrigger>
											<ExpandableMenuItemContent>
												<ExpandableMenuItem>
													<ExpandableMenuItemTrigger
														href="#"
														elemBefore={<ChartBarIcon label="" />}
													>
														Exp link menu item (level 2)
													</ExpandableMenuItemTrigger>
													<ExpandableMenuItemContent>
														<LinkMenuItem href="#">Expandable menu item content</LinkMenuItem>
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
			</div>

			<div css={mockSideNavStyles.root}>
				<SideNavContent>
					<MenuList>
						<ExpandableMenuItem>
							<ExpandableMenuItemTrigger
								href="#"
								elemBefore={<HomeIcon label="" color="currentColor" spacing="spacious" />}
								isSelected={isMenuItemSelected}
								onClick={() => setIsMenuItemSelected(!isMenuItemSelected)}
							>
								Exp link menu item (click to select)
							</ExpandableMenuItemTrigger>
							<PlaceholderExpandableContent />
						</ExpandableMenuItem>

						<ExpandableMenuItem>
							<ExpandableMenuItemTrigger
								href="#"
								elemBefore={<HomeIcon label="" color="currentColor" spacing="spacious" />}
								actions={
									<>
										<AddAction />
										<MoreAction />
									</>
								}
							>
								Exp link menu item (actions)
							</ExpandableMenuItemTrigger>
							<PlaceholderExpandableContent />
						</ExpandableMenuItem>

						<ExpandableMenuItem>
							<ExpandableMenuItemTrigger
								href="#"
								elemBefore={<HomeIcon label="" color="currentColor" spacing="spacious" />}
								actionsOnHover={
									<>
										<AddAction />
										<MoreAction />
									</>
								}
							>
								Exp link menu item (actionsOnHover)
							</ExpandableMenuItemTrigger>
							<PlaceholderExpandableContent />
						</ExpandableMenuItem>

						<ExpandableMenuItem>
							<ExpandableMenuItemTrigger
								elemBefore={<HomeIcon label="" color="currentColor" spacing="spacious" />}
								actions={<MoreAction />}
								actionsOnHover={<AddAction />}
							>
								Exp link menu item (actions & actionsOnHover)
							</ExpandableMenuItemTrigger>
							<PlaceholderExpandableContent />
						</ExpandableMenuItem>

						<ExpandableMenuItem>
							<ExpandableMenuItemTrigger
								href="#"
								elemBefore={<HomeIcon label="" color="currentColor" spacing="spacious" />}
								elemAfter={<Lozenge>New</Lozenge>}
							>
								Exp link menu item (elemAfter)
							</ExpandableMenuItemTrigger>
							<PlaceholderExpandableContent />
						</ExpandableMenuItem>

						<ExpandableMenuItem>
							<ExpandableMenuItemTrigger
								href="#"
								elemBefore={<HomeIcon label="" color="currentColor" spacing="spacious" />}
								elemAfter={<Lozenge>New</Lozenge>}
								actions={<MoreAction />}
								actionsOnHover={<AddAction />}
							>
								Exp link menu item (elemAfter, actions & actionsOnHover)
							</ExpandableMenuItemTrigger>
							<PlaceholderExpandableContent />
						</ExpandableMenuItem>
					</MenuList>
				</SideNavContent>
			</div>
		</Inline>
	);
}

export default ExpandableMenuItemLinkVariantExample;
