/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React from 'react';

import { jsx } from '@compiled/react';

import { IconButton } from '@atlaskit/button/new';
import { cssMap } from '@atlaskit/css';
import Heading from '@atlaskit/heading';
import AddIcon from '@atlaskit/icon/core/add';
import AlignTextLeftIcon from '@atlaskit/icon/core/align-text-left';
import BoardIcon from '@atlaskit/icon/core/board';
import ClockIcon from '@atlaskit/icon/core/clock';
import InboxIcon from '@atlaskit/icon/core/inbox';
import MegaphoneIcon from '@atlaskit/icon/core/megaphone';
import ProjectIcon from '@atlaskit/icon/core/project';
import MoreIcon from '@atlaskit/icon/core/show-more-horizontal';
import Lozenge from '@atlaskit/lozenge';
import { Main } from '@atlaskit/navigation-system/layout/main';
import { PanelSplitter } from '@atlaskit/navigation-system/layout/panel-splitter';
import { Root } from '@atlaskit/navigation-system/layout/root';
import {
	SideNav,
	SideNavContent,
	SideNavFooter,
	SideNavHeader,
	SideNavToggleButton,
} from '@atlaskit/navigation-system/layout/side-nav';
import {
	TopNav,
	TopNavEnd,
	TopNavMiddle,
	TopNavStart,
} from '@atlaskit/navigation-system/layout/top-nav';
import { ButtonMenuItem } from '@atlaskit/navigation-system/side-nav-items/button-menu-item';
import {
	ExpandableMenuItem,
	ExpandableMenuItemContent,
	ExpandableMenuItemTrigger,
} from '@atlaskit/navigation-system/side-nav-items/expandable-menu-item';
import {
	FlyoutMenuItem,
	FlyoutMenuItemContent,
	FlyoutMenuItemTrigger,
} from '@atlaskit/navigation-system/side-nav-items/flyout-menu-item';
import { LinkMenuItem } from '@atlaskit/navigation-system/side-nav-items/link-menu-item';
import { Divider } from '@atlaskit/navigation-system/side-nav-items/menu-section';
import { CreateButton, Settings } from '@atlaskit/navigation-system/top-nav-items';
import { token } from '@atlaskit/tokens';

import { WithResponsiveViewport } from './utils/example-utils';

const headingStyles = cssMap({
	root: {
		paddingInline: token('space.300'),
		paddingBlockStart: token('space.300'),
	},
});

function NestedExpandable({ children, label }: { children?: React.ReactNode; label: string }) {
	return (
		<ExpandableMenuItem isDefaultExpanded>
			<ExpandableMenuItemTrigger
				elemBefore={<ProjectIcon label="" color="currentColor" />}
				elemAfter={<Lozenge>elem after</Lozenge>}
				actions={
					<IconButton
						key="add"
						label="Add"
						icon={(iconProps) => <AddIcon {...iconProps} size="small" />}
						appearance="subtle"
						spacing="compact"
					/>
				}
				actionsOnHover={
					<IconButton
						key="more"
						label="More"
						icon={(iconProps) => <MoreIcon {...iconProps} size="small" />}
						appearance="subtle"
						spacing="compact"
					/>
				}
			>
				{label}
			</ExpandableMenuItemTrigger>

			<ExpandableMenuItemContent>{children}</ExpandableMenuItemContent>
		</ExpandableMenuItem>
	);
}

export function MenuItemsDeeplyNestedVR() {
	return <MenuItemsDeeplyNestedExample isDeepNestedItemSelected={false} />;
}

export function MenuItemsDeeplyNestedSelectedVR() {
	return <MenuItemsDeeplyNestedExample isDeepNestedItemSelected />;
}

function MenuItemsDeeplyNestedExample({
	isDeepNestedItemSelected = false,
}: {
	isDeepNestedItemSelected?: boolean;
}) {
	return (
		<WithResponsiveViewport>
			<Root>
				<TopNav>
					<TopNavStart>
						<SideNavToggleButton
							testId="side-nav-toggle-button"
							collapseLabel="Collapse sidebar"
							expandLabel="Expand sidebar"
						/>
					</TopNavStart>
					<TopNavMiddle>
						<CreateButton>Create</CreateButton>
					</TopNavMiddle>
					<TopNavEnd>
						<Settings label="Settings" />
					</TopNavEnd>
				</TopNav>
				<SideNav defaultWidth={240}>
					<SideNavHeader>
						<Heading size="xsmall">Settings</Heading>
					</SideNavHeader>

					<SideNavContent testId="side-nav-content">
						<LinkMenuItem href="#" elemBefore={<InboxIcon label="" color="currentColor" />}>
							Your work
						</LinkMenuItem>
						<FlyoutMenuItem>
							<FlyoutMenuItemTrigger elemBefore={<ClockIcon label="" color="currentColor" />}>
								Recent
							</FlyoutMenuItemTrigger>
							<FlyoutMenuItemContent>
								<LinkMenuItem href="#" elemBefore={<BoardIcon label="" color="currentColor" />}>
									YNG board
								</LinkMenuItem>
								<Divider />
								<LinkMenuItem
									href="#"
									elemBefore={<AlignTextLeftIcon label="" color="currentColor" />}
								>
									View all starred items
								</LinkMenuItem>
							</FlyoutMenuItemContent>
						</FlyoutMenuItem>
						<NestedExpandable label="Project 1">
							<NestedExpandable label="Project 2">
								<NestedExpandable label="Project 3">
									<NestedExpandable label="Project 4">
										<NestedExpandable label="Project 5">
											<NestedExpandable label="Project 6">
												<NestedExpandable label="Project 7">
													<NestedExpandable label="Project 8">
														<NestedExpandable label="Project 9">
															<NestedExpandable label="Project 10">
																<NestedExpandable label="Project 11">
																	<NestedExpandable label="Project 12">
																		<NestedExpandable label="Project 13">
																			<LinkMenuItem
																				href="#"
																				elemBefore={<BoardIcon label="" color="currentColor" />}
																				elemAfter={<Lozenge>elem after</Lozenge>}
																				actions={
																					<IconButton
																						key="add"
																						label="Add"
																						icon={(iconProps) => (
																							<AddIcon {...iconProps} size="small" />
																						)}
																						appearance="subtle"
																						spacing="compact"
																					/>
																				}
																				actionsOnHover={
																					<IconButton
																						key="more"
																						label="More"
																						icon={(iconProps) => (
																							<MoreIcon {...iconProps} size="small" />
																						)}
																						appearance="subtle"
																						spacing="compact"
																					/>
																				}
																			>
																				Nested link menu item
																			</LinkMenuItem>
																			<NestedExpandable label="Project 14">
																				<NestedExpandable label="Project 15">
																					<NestedExpandable label="Project 16">
																						<NestedExpandable label="Project 17">
																							<NestedExpandable label="Project 18">
																								<NestedExpandable label="Project 19">
																									<NestedExpandable label="Project 20">
																										<LinkMenuItem
																											isSelected={isDeepNestedItemSelected}
																											href="#"
																											elemBefore={
																												<BoardIcon label="" color="currentColor" />
																											}
																											elemAfter={<Lozenge>elem after</Lozenge>}
																											actions={
																												<IconButton
																													key="add"
																													label="Add"
																													icon={(iconProps) => (
																														<AddIcon {...iconProps} size="small" />
																													)}
																													appearance="subtle"
																													spacing="compact"
																												/>
																											}
																											actionsOnHover={
																												<IconButton
																													key="more"
																													label="More"
																													icon={(iconProps) => (
																														<MoreIcon {...iconProps} size="small" />
																													)}
																													appearance="subtle"
																													spacing="compact"
																												/>
																											}
																										>
																											Nested link menu item
																										</LinkMenuItem>

																										<ButtonMenuItem
																											elemBefore={
																												<BoardIcon label="" color="currentColor" />
																											}
																											elemAfter={<Lozenge>elem after</Lozenge>}
																											actions={
																												<IconButton
																													key="add"
																													label="Add"
																													icon={(iconProps) => (
																														<AddIcon {...iconProps} size="small" />
																													)}
																													appearance="subtle"
																													spacing="compact"
																												/>
																											}
																											actionsOnHover={
																												<IconButton
																													key="more"
																													label="More"
																													icon={(iconProps) => (
																														<MoreIcon {...iconProps} size="small" />
																													)}
																													appearance="subtle"
																													spacing="compact"
																												/>
																											}
																										>
																											Nested button menu item
																										</ButtonMenuItem>
																										<FlyoutMenuItem>
																											<FlyoutMenuItemTrigger
																												elemBefore={
																													<ClockIcon
																														label=""
																														color="currentColor"
																													/>
																												}
																											>
																												Nested flyout menu item
																											</FlyoutMenuItemTrigger>
																											<FlyoutMenuItemContent>
																												<LinkMenuItem
																													href="#"
																													elemBefore={
																														<BoardIcon
																															label=""
																															color="currentColor"
																														/>
																													}
																												>
																													Flyout content
																												</LinkMenuItem>
																											</FlyoutMenuItemContent>
																										</FlyoutMenuItem>
																									</NestedExpandable>
																								</NestedExpandable>
																							</NestedExpandable>
																						</NestedExpandable>
																					</NestedExpandable>
																				</NestedExpandable>
																			</NestedExpandable>
																		</NestedExpandable>
																	</NestedExpandable>
																</NestedExpandable>
															</NestedExpandable>
														</NestedExpandable>
													</NestedExpandable>
												</NestedExpandable>
											</NestedExpandable>
										</NestedExpandable>
									</NestedExpandable>
								</NestedExpandable>
							</NestedExpandable>
						</NestedExpandable>
					</SideNavContent>

					<SideNavFooter>
						<LinkMenuItem href="#" elemBefore={<MegaphoneIcon label="" color="currentColor" />}>
							Give feedback on the new navigation
						</LinkMenuItem>
					</SideNavFooter>
					<PanelSplitter label="Resize side nav" />
				</SideNav>

				<Main id="main-container">
					<div css={headingStyles.root}>
						<Heading size="small">Board settings</Heading>
					</div>
				</Main>
			</Root>
		</WithResponsiveViewport>
	);
}

export default MenuItemsDeeplyNestedExample;
