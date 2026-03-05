/**
 * @jsxfrag
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useCallback, useState } from 'react';

import { IconButton } from '@atlaskit/button/new';
import { jsx } from '@atlaskit/css';
import AddIcon from '@atlaskit/icon/core/add';
import ChartBarIcon from '@atlaskit/icon/core/chart-bar';
import ClockIcon from '@atlaskit/icon/core/clock';
import HomeIcon from '@atlaskit/icon/core/home';
import InboxIcon from '@atlaskit/icon/core/inbox';
import MoreIcon from '@atlaskit/icon/core/show-more-horizontal';
import { JiraIcon } from '@atlaskit/logo';
import Lozenge from '@atlaskit/lozenge';
import { SideNavContent } from '@atlaskit/navigation-system/layout/side-nav';
import { Inline } from '@atlaskit/primitives/compiled';
import { ContainerAvatar } from '@atlaskit/side-nav-items/container-avatar';
import {
	ExpandableMenuItem,
	ExpandableMenuItemContent,
	ExpandableMenuItemTrigger,
} from '@atlaskit/side-nav-items/expandable-menu-item';
import { LinkMenuItem } from '@atlaskit/side-nav-items/link-menu-item';
import { MenuList } from '@atlaskit/side-nav-items/menu-list';
import { MenuSection, MenuSectionHeading } from '@atlaskit/side-nav-items/menu-section';

import MoneyIcon from '../images/money.svg';

import { MockSideNav } from './common/mock-side-nav';

const exampleHref = '#example-href';

function PlaceholderExpandableContent({
	isSelected,
	onClick,
}: {
	isSelected: boolean;
	onClick: (event: React.MouseEvent) => void;
}) {
	return (
		<ExpandableMenuItemContent>
			<LinkMenuItem
				href={exampleHref}
				elemBefore={<ClockIcon label="" spacing="spacious" />}
				isSelected={isSelected}
				onClick={onClick}
			>
				Link menu item
			</LinkMenuItem>
		</ExpandableMenuItemContent>
	);
}

function AddAction() {
	return (
		<IconButton
			spacing="compact"
			appearance="subtle"
			label="Add"
			icon={(iconProps) => <AddIcon {...iconProps} size="small" spacing="spacious" />}
		/>
	);
}

function MoreAction() {
	return (
		<IconButton
			spacing="compact"
			appearance="subtle"
			label="More"
			icon={(iconProps) => <MoreIcon {...iconProps} size="small" spacing="spacious" />}
		/>
	);
}

// Examples of the link variant of the expandable menu item.
// This means there is an href provided.
// Clicking on a trigger will select it, demonstrating the selected state.
export function ExpandableMenuItemLinkVariantExample() {
	// Track which menu item is currently selected by its unique id
	const [selectedId, setSelectedId] = useState<string | null>(null);

	// Creates a click handler that selects the item with the given id.
	// Clicking an already-selected item will _not_ deselect it.
	const createClickHandler = useCallback(
		(id: string) => (event: React.MouseEvent) => {
			// Prevent the default behavior of the link so the URL is not changed when clicked.
			event.preventDefault();

			setSelectedId(id);
		},
		[],
	);

	return (
		<Inline space="space.600">
			<MockSideNav>
				<SideNavContent>
					<MenuList>
						<ExpandableMenuItem>
							<ExpandableMenuItemTrigger
								href={exampleHref}
								isSelected={selectedId === 'default'}
								onClick={createClickHandler('default')}
							>
								Exp link menu item (default)
							</ExpandableMenuItemTrigger>
							<PlaceholderExpandableContent
								isSelected={selectedId === 'default-content'}
								onClick={createClickHandler('default-content')}
							/>
						</ExpandableMenuItem>

						<ExpandableMenuItem>
							<ExpandableMenuItemTrigger
								href={exampleHref}
								elemBefore={<HomeIcon label="" spacing="spacious" />}
								isSelected={selectedId === 'icon'}
								onClick={createClickHandler('icon')}
							>
								Exp link menu item (icon)
							</ExpandableMenuItemTrigger>
							<PlaceholderExpandableContent
								isSelected={selectedId === 'icon-content'}
								onClick={createClickHandler('icon-content')}
							/>
						</ExpandableMenuItem>

						<ExpandableMenuItem>
							<ExpandableMenuItemTrigger
								href={exampleHref}
								elemBefore={<ContainerAvatar src={MoneyIcon} />}
								isSelected={selectedId === 'container-avatar'}
								onClick={createClickHandler('container-avatar')}
							>
								Exp link menu item (ContainerAvatar)
							</ExpandableMenuItemTrigger>
							<PlaceholderExpandableContent
								isSelected={selectedId === 'container-avatar-content'}
								onClick={createClickHandler('container-avatar-content')}
							/>
						</ExpandableMenuItem>

						<ExpandableMenuItem>
							<ExpandableMenuItemTrigger
								href={exampleHref}
								elemBefore={<JiraIcon label="" shouldUseNewLogoDesign size="xsmall" />}
								isSelected={selectedId === 'app-tile'}
								onClick={createClickHandler('app-tile')}
							>
								Exp link menu item (app tile)
							</ExpandableMenuItemTrigger>
							<PlaceholderExpandableContent
								isSelected={selectedId === 'app-tile-content'}
								onClick={createClickHandler('app-tile-content')}
							/>
						</ExpandableMenuItem>

						<ExpandableMenuItem isDefaultExpanded>
							<ExpandableMenuItemTrigger
								href={exampleHref}
								isSelected={selectedId === 'level-0'}
								onClick={createClickHandler('level-0')}
							>
								Exp link menu item (level 0)
							</ExpandableMenuItemTrigger>
							<ExpandableMenuItemContent>
								<MenuSection isMenuListItem>
									<MenuSectionHeading>Menus section heading (Level 1)</MenuSectionHeading>
									<MenuList>
										<ExpandableMenuItem>
											<ExpandableMenuItemTrigger
												href={exampleHref}
												elemBefore={<InboxIcon label="" spacing="spacious" />}
												isSelected={selectedId === 'level-1a'}
												onClick={createClickHandler('level-1a')}
											>
												Exp link menu item (level 1)
											</ExpandableMenuItemTrigger>
											<ExpandableMenuItemContent>
												<ExpandableMenuItem>
													<ExpandableMenuItemTrigger
														href={exampleHref}
														elemBefore={<ChartBarIcon label="" spacing="spacious" />}
														isSelected={selectedId === 'level-2a'}
														onClick={createClickHandler('level-2a')}
													>
														Exp link menu item (level 2)
													</ExpandableMenuItemTrigger>
													<PlaceholderExpandableContent
														isSelected={selectedId === 'level-2a-content'}
														onClick={createClickHandler('level-2a-content')}
													/>
												</ExpandableMenuItem>
											</ExpandableMenuItemContent>
										</ExpandableMenuItem>

										<ExpandableMenuItem isDefaultExpanded>
											<ExpandableMenuItemTrigger
												href={exampleHref}
												elemBefore={<InboxIcon label="" spacing="spacious" />}
												isSelected={selectedId === 'level-1b'}
												onClick={createClickHandler('level-1b')}
											>
												Exp link menu item (level 1)
											</ExpandableMenuItemTrigger>
											<ExpandableMenuItemContent>
												<ExpandableMenuItem>
													<ExpandableMenuItemTrigger
														href={exampleHref}
														elemBefore={<ChartBarIcon label="" spacing="spacious" />}
														isSelected={selectedId === 'level-2b'}
														onClick={createClickHandler('level-2b')}
													>
														Exp link menu item (level 2)
													</ExpandableMenuItemTrigger>
													<ExpandableMenuItemContent>
														<PlaceholderExpandableContent
															isSelected={selectedId === 'level-2b-content'}
															onClick={createClickHandler('level-2b-content')}
														/>
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
								href={exampleHref}
								elemBefore={<HomeIcon label="" spacing="spacious" />}
								actions={
									<>
										<AddAction />
										<MoreAction />
									</>
								}
								isSelected={selectedId === 'actions'}
								onClick={createClickHandler('actions')}
							>
								Exp link menu item (actions)
							</ExpandableMenuItemTrigger>
							<PlaceholderExpandableContent
								isSelected={selectedId === 'actions-content'}
								onClick={createClickHandler('actions-content')}
							/>
						</ExpandableMenuItem>

						<ExpandableMenuItem>
							<ExpandableMenuItemTrigger
								href={exampleHref}
								elemBefore={<HomeIcon label="" spacing="spacious" />}
								actionsOnHover={
									<>
										<AddAction />
										<MoreAction />
									</>
								}
								isSelected={selectedId === 'actions-on-hover'}
								onClick={createClickHandler('actions-on-hover')}
							>
								Exp link menu item (actionsOnHover)
							</ExpandableMenuItemTrigger>
							<PlaceholderExpandableContent
								isSelected={selectedId === 'actions-on-hover-content'}
								onClick={createClickHandler('actions-on-hover-content')}
							/>
						</ExpandableMenuItem>

						<ExpandableMenuItem>
							<ExpandableMenuItemTrigger
								elemBefore={<HomeIcon label="" spacing="spacious" />}
								actions={<MoreAction />}
								actionsOnHover={<AddAction />}
								isSelected={selectedId === 'actions-both'}
								onClick={createClickHandler('actions-both')}
							>
								Exp link menu item (actions & actionsOnHover)
							</ExpandableMenuItemTrigger>
							<PlaceholderExpandableContent
								isSelected={selectedId === 'actions-both-content'}
								onClick={createClickHandler('actions-both-content')}
							/>
						</ExpandableMenuItem>

						<ExpandableMenuItem>
							<ExpandableMenuItemTrigger
								href={exampleHref}
								elemBefore={<HomeIcon label="" />}
								elemAfter={<Lozenge>New</Lozenge>}
								isSelected={selectedId === 'elem-after'}
								onClick={createClickHandler('elem-after')}
							>
								Exp link menu item (elemAfter)
							</ExpandableMenuItemTrigger>
							<PlaceholderExpandableContent
								isSelected={selectedId === 'elem-after-content'}
								onClick={createClickHandler('elem-after-content')}
							/>
						</ExpandableMenuItem>

						<ExpandableMenuItem>
							<ExpandableMenuItemTrigger
								href={exampleHref}
								elemBefore={<HomeIcon label="" />}
								elemAfter={<Lozenge>New</Lozenge>}
								actions={<MoreAction />}
								actionsOnHover={<AddAction />}
								isSelected={selectedId === 'elem-after-actions'}
								onClick={createClickHandler('elem-after-actions')}
							>
								Exp link menu item (elemAfter, actions & actionsOnHover)
							</ExpandableMenuItemTrigger>
							<PlaceholderExpandableContent
								isSelected={selectedId === 'elem-after-actions-content'}
								onClick={createClickHandler('elem-after-actions-content')}
							/>
						</ExpandableMenuItem>
					</MenuList>
				</SideNavContent>
			</MockSideNav>
		</Inline>
	);
}

export default ExpandableMenuItemLinkVariantExample;
