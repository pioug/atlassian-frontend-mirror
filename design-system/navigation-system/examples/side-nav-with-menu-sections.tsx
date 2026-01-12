/**
 * @jsxFrag
 * @jsxRuntime classic
 * @jsx jsx
 */

import React, { type ReactNode } from 'react';

import { cssMap, jsx } from '@compiled/react';

import Badge from '@atlaskit/badge';
import { IconButton } from '@atlaskit/button/new';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import AssetsGraph from '@atlaskit/icon-lab/core/assets-graph';
import AddIcon from '@atlaskit/icon/core/add';
import AlignTextLeftIcon from '@atlaskit/icon/core/align-text-left';
import AppsIcon from '@atlaskit/icon/core/apps';
import BoardIcon from '@atlaskit/icon/core/board';
import ChartBarIcon from '@atlaskit/icon/core/chart-bar';
import ClockIcon from '@atlaskit/icon/core/clock';
import CustomizeIcon from '@atlaskit/icon/core/customize';
import DashboardIcon from '@atlaskit/icon/core/dashboard';
import FileIcon from '@atlaskit/icon/core/file';
import FilterIcon from '@atlaskit/icon/core/filter';
import GlobeIcon from '@atlaskit/icon/core/globe';
import InboxIcon from '@atlaskit/icon/core/inbox';
import LinkExternalIcon from '@atlaskit/icon/core/link-external';
import PersonAvatarIcon from '@atlaskit/icon/core/person-avatar';
import ProjectIcon from '@atlaskit/icon/core/project';
import QuestionCircleIcon from '@atlaskit/icon/core/question-circle';
import SearchIcon from '@atlaskit/icon/core/search';
import ShieldIcon from '@atlaskit/icon/core/shield';
import ShowMoreHorizontalIcon from '@atlaskit/icon/core/show-more-horizontal';
import StarUnstarredIcon from '@atlaskit/icon/core/star-unstarred';
import TeamsIcon from '@atlaskit/icon/core/teams';
import { ConfluenceIcon, JiraIcon } from '@atlaskit/logo';
import { Root } from '@atlaskit/navigation-system/layout/root';
import {
	SideNav,
	SideNavContent,
	SideNavPanelSplitter,
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
	FlyoutBody,
	FlyoutFooter,
	FlyoutHeader,
	FlyoutMenuItem,
	FlyoutMenuItemContent,
	FlyoutMenuItemTrigger,
} from '@atlaskit/navigation-system/side-nav-items/flyout-menu-item';
import { LinkMenuItem } from '@atlaskit/navigation-system/side-nav-items/link-menu-item';
import { MenuList } from '@atlaskit/navigation-system/side-nav-items/menu-list';
import { MenuListItem } from '@atlaskit/navigation-system/side-nav-items/menu-list-item';
import {
	MenuSection,
	MenuSectionHeading,
} from '@atlaskit/navigation-system/side-nav-items/menu-section';
import { TopLevelSpacer } from '@atlaskit/navigation-system/side-nav-items/top-level-spacer';
import {
	AppLogo,
	AppSwitcher,
	CreateButton,
	Help,
	Notifications,
	Profile,
	Search,
	Settings,
} from '@atlaskit/navigation-system/top-nav-items';
import { Box, Inline } from '@atlaskit/primitives/compiled';
import Textfield from '@atlaskit/textfield';
import { token } from '@atlaskit/tokens';

const filterIcon = <FilterIcon label="" color="currentColor" spacing="spacious" />;
const searchIcon = <SearchIcon label="" color="currentColor" spacing="spacious" />;

const textfieldStyles = cssMap({
	root: {
		paddingInlineStart: token('space.075'),
		paddingInlineEnd: token('space.025'),
		paddingBlockStart: token('space.025'),
	},
});

// Project tiles have a 20x20 size
const projectTileStyles = cssMap({
	root: {
		width: '20px',
		height: '20px',
		borderRadius: '3px',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		color: '#FFFFFF',
	},
});

function ProjectTile({
	backgroundColor,
	children,
}: {
	backgroundColor: string;
	children: ReactNode;
}) {
	return (
		<div css={projectTileStyles.root} style={{ backgroundColor }} role="presentation">
			{children}
		</div>
	);
}

const AddAction = () => (
	<IconButton
		spacing="compact"
		appearance="subtle"
		label="Add"
		icon={(iconProps) => <AddIcon {...iconProps} size="small" />}
	/>
);

const MoreAction = () => (
	<IconButton
		spacing="compact"
		appearance="subtle"
		label="More options"
		icon={(iconProps) => <ShowMoreHorizontalIcon {...iconProps} size="small" />}
	/>
);

const items = [
	{
		label: 'Modernize typography',
		icon: <FileIcon label="" color="currentColor" spacing="spacious" />,
		description: 'Design Systems Team',
	},
	{
		label: 'F1 sponsorship',
		icon: <BoardIcon label="" color="currentColor" spacing="spacious" />,
		description: 'Marketing Team',
	},
	{
		label: 'Mobile application',
		icon: <ProjectIcon label="" color="currentColor" spacing="spacious" />,
		description: 'Mobile Platform Team',
	},
	{
		label: 'Attachments',
		icon: <InboxIcon label="" color="currentColor" spacing="spacious" />,
		description: 'Core Services Team',
	},
	{
		label: 'Audit',
		icon: <GlobeIcon label="" color="currentColor" spacing="spacious" />,
		description: 'Security Team',
	},
	{
		label: 'Dark mode',
		icon: <ChartBarIcon label="" color="currentColor" spacing="spacious" />,
		description: 'UI Platform Team',
	},
	{
		label: 'Visualization',
		icon: <DashboardIcon label="" color="currentColor" spacing="spacious" />,
		description: 'Analytics Team',
	},
	{
		label: 'Basketball tournament',
		icon: <FilterIcon label="" color="currentColor" spacing="spacious" />,
		description: 'Events Team',
	},
	{
		label: 'Design system migration',
		icon: <FileIcon label="" color="currentColor" spacing="spacious" />,
		description: 'Frontend Infrastructure Team',
	},
	{
		label: 'User research findings',
		icon: <BoardIcon label="" color="currentColor" spacing="spacious" />,
		description: 'Research Team',
	},
	{
		label: 'Q4 planning',
		icon: <ProjectIcon label="" color="currentColor" spacing="spacious" />,
		description: 'Product Management Team',
	},
	{
		label: 'Accessibility audit',
		icon: <InboxIcon label="" color="currentColor" spacing="spacious" />,
		description: 'A11y Team',
	},
];

function RandomItems({
	count,
	shouldHaveDescription = false,
}: {
	count: number;
	shouldHaveDescription?: boolean;
}) {
	return Array.from({ length: count }, (_, index) => {
		const itemIndex = index % items.length;
		const item = items[itemIndex];
		return (
			<ButtonMenuItem
				key={index}
				elemBefore={item.icon}
				description={shouldHaveDescription ? item.description : undefined}
			>
				{item.label}
			</ButtonMenuItem>
		);
	});
}

export default function SideNavWithMenuSections() {
	return (
		<Root isSideNavShortcutEnabled>
			<TopNav>
				<TopNavStart
					sideNavToggleButton={
						<SideNavToggleButton collapseLabel="Collapse sidebar" expandLabel="Expand sidebar" />
					}
				>
					<AppSwitcher label="Switch apps" />
					<AppLogo href="" icon={JiraIcon} name="Jira" label="Home page" />
				</TopNavStart>
				<TopNavMiddle>
					<Search label="Search" />
					<CreateButton>Create</CreateButton>
				</TopNavMiddle>
				<TopNavEnd>
					<Help label="Help" />
					<Notifications
						badge={() => (
							<Badge max={9} appearance="important">
								{99999}
							</Badge>
						)}
						label="Notifications"
					/>
					<Settings label="Settings" />
					<MenuListItem>
						<DropdownMenu
							shouldRenderToParent
							trigger={({ triggerRef: ref, ...props }) => (
								<Profile ref={ref} label="Profile" {...props} isListItem={false} />
							)}
						>
							<DropdownItemGroup>
								<DropdownItem>Account</DropdownItem>
							</DropdownItemGroup>
						</DropdownMenu>
					</MenuListItem>
				</TopNavEnd>
			</TopNav>

			<SideNav>
				<SideNavContent>
					<MenuList>
						<LinkMenuItem
							href="#"
							elemBefore={<PersonAvatarIcon label="" color="currentColor" />}
							isSelected
						>
							For you
						</LinkMenuItem>

						<FlyoutMenuItem>
							<FlyoutMenuItemTrigger elemBefore={<ClockIcon label="" color="currentColor" />}>
								Recent
							</FlyoutMenuItemTrigger>
							<FlyoutMenuItemContent>
								<FlyoutHeader title="Recent" closeButtonLabel="Close">
									<Inline space="space.100">
										<Textfield
											isCompact
											elemBeforeInput={
												<Box xcss={textfieldStyles.root}>
													<SearchIcon label="" spacing="spacious" />
												</Box>
											}
											placeholder="Search recent items"
										/>
									</Inline>
								</FlyoutHeader>
								<FlyoutBody>
									<MenuList>
										<MenuSection isMenuListItem>
											<MenuSectionHeading>Today</MenuSectionHeading>
											<MenuList>
												<RandomItems count={4} shouldHaveDescription />
											</MenuList>
										</MenuSection>
										<MenuSection isMenuListItem>
											<MenuSectionHeading>Yesterday</MenuSectionHeading>
											<MenuList>
												<RandomItems count={2} shouldHaveDescription />
											</MenuList>
										</MenuSection>
										<MenuSection isMenuListItem>
											<MenuSectionHeading>This week</MenuSectionHeading>
											<MenuList>
												<RandomItems count={20} shouldHaveDescription />
											</MenuList>
										</MenuSection>
									</MenuList>
								</FlyoutBody>
								<FlyoutFooter>
									<MenuList>
										<ButtonMenuItem>View all recent items</ButtonMenuItem>
									</MenuList>
								</FlyoutFooter>
							</FlyoutMenuItemContent>
						</FlyoutMenuItem>

						<FlyoutMenuItem>
							<FlyoutMenuItemTrigger
								elemBefore={<StarUnstarredIcon label="" color="currentColor" />}
							>
								Starred
							</FlyoutMenuItemTrigger>
							<FlyoutMenuItemContent>
								<FlyoutHeader title="Starred" closeButtonLabel="Close">
									<Inline space="space.100">
										<Textfield
											isCompact
											elemBeforeInput={
												<Box xcss={textfieldStyles.root}>
													<SearchIcon label="" spacing="spacious" />
												</Box>
											}
											placeholder="Search starred items"
										/>
									</Inline>
								</FlyoutHeader>
								<FlyoutBody>
									<MenuList>
										<RandomItems count={30} />
									</MenuList>
								</FlyoutBody>
								<FlyoutFooter>
									<MenuList>
										<ButtonMenuItem>View all starred items</ButtonMenuItem>
									</MenuList>
								</FlyoutFooter>
							</FlyoutMenuItemContent>
						</FlyoutMenuItem>

						<ExpandableMenuItem>
							<ExpandableMenuItemTrigger elemBefore={<AppsIcon label="" color="currentColor" />}>
								Apps
							</ExpandableMenuItemTrigger>
							<ExpandableMenuItemContent>
								<MenuList>
									<ButtonMenuItem>App 1</ButtonMenuItem>
								</MenuList>
							</ExpandableMenuItemContent>
						</ExpandableMenuItem>

						<ExpandableMenuItem isDefaultExpanded>
							<ExpandableMenuItemTrigger
								elemBefore={<GlobeIcon label="" color="currentColor" />}
								actionsOnHover={
									<>
										<AddAction />
										<MoreAction />
									</>
								}
							>
								Spaces
							</ExpandableMenuItemTrigger>
							<ExpandableMenuItemContent>
								<MenuList>
									<MenuListItem>
										<MenuSection>
											<MenuSectionHeading>Starred</MenuSectionHeading>
											<MenuList>
												<ExpandableMenuItem isDefaultExpanded>
													<ExpandableMenuItemTrigger
														elemBefore={
															<ProjectTile
																backgroundColor={token('color.background.accent.blue.bolder')}
															>
																<ProjectIcon label="" color="currentColor" />
															</ProjectTile>
														}
														actionsOnHover={
															<>
																<AddAction />
																<MoreAction />
															</>
														}
													>
														Design System Project
													</ExpandableMenuItemTrigger>
													<ExpandableMenuItemContent>
														<MenuList>
															<ButtonMenuItem elemBefore={filterIcon}>
																DS Claret team
															</ButtonMenuItem>
															<ButtonMenuItem elemBefore={filterIcon}>
																DS Almonds Component Servicing
															</ButtonMenuItem>
															<ButtonMenuItem elemBefore={filterIcon}>
																DS TEAM Camp Tasks
															</ButtonMenuItem>
															<ButtonMenuItem elemBefore={filterIcon}>DS Almonds</ButtonMenuItem>
															<ButtonMenuItem elemBefore={filterIcon}>
																DS Accessibility
															</ButtonMenuItem>
															<ButtonMenuItem elemBefore={filterIcon}>DS Adoption</ButtonMenuItem>
														</MenuList>
													</ExpandableMenuItemContent>
												</ExpandableMenuItem>
												<ButtonMenuItem
													elemBefore={
														<AlignTextLeftIcon label="" color="currentColor" spacing="spacious" />
													}
												>
													View all boards
												</ButtonMenuItem>
												<ButtonMenuItem
													elemBefore={
														<ProjectTile
															backgroundColor={token('color.background.accent.orange.bolder')}
														>
															<QuestionCircleIcon label="" color="currentColor" />
														</ProjectTile>
													}
												>
													Help Design System
												</ButtonMenuItem>
											</MenuList>
										</MenuSection>
									</MenuListItem>
									<MenuListItem>
										<MenuSection>
											<MenuSectionHeading>Recent</MenuSectionHeading>
											<MenuList>
												<ButtonMenuItem
													elemBefore={
														<ProjectTile
															backgroundColor={token('color.background.accent.purple.bolder')}
														>
															<StarUnstarredIcon label="" color="currentColor" />
														</ProjectTile>
													}
												>
													Pyxis
												</ButtonMenuItem>
												<ButtonMenuItem
													elemBefore={
														<ProjectTile
															backgroundColor={token('color.background.accent.gray.bolder')}
														>
															<AppsIcon label="" color="currentColor" />
														</ProjectTile>
													}
												>
													Studio foundation
												</ButtonMenuItem>
												<ButtonMenuItem
													elemBefore={
														<ProjectTile
															backgroundColor={token('color.background.accent.yellow.bolder')}
														>
															<ProjectIcon label="" color="currentColor" />
														</ProjectTile>
													}
												>
													AI Native Design & Content System
												</ButtonMenuItem>
												<ButtonMenuItem
													elemBefore={
														<ProjectTile
															backgroundColor={token('color.background.accent.blue.bolder')}
														>
															<ChartBarIcon label="" color="currentColor" />
														</ProjectTile>
													}
												>
													App Framework and Bundler
												</ButtonMenuItem>
												<ButtonMenuItem
													elemBefore={
														<ProjectTile
															backgroundColor={token('color.background.accent.green.bolder')}
														>
															<TeamsIcon label="" color="currentColor" />
														</ProjectTile>
													}
												>
													Design System Team
												</ButtonMenuItem>
											</MenuList>
										</MenuSection>
									</MenuListItem>
									<LinkMenuItem
										href="#"
										elemBefore={
											<AlignTextLeftIcon label="" color="currentColor" spacing="spacious" />
										}
									>
										More spaces
									</LinkMenuItem>
									<ButtonMenuItem
										elemBefore={
											<AlignTextLeftIcon label="" color="currentColor" spacing="spacious" />
										}
									>
										Browse templates
									</ButtonMenuItem>
								</MenuList>
							</ExpandableMenuItemContent>
						</ExpandableMenuItem>

						<ExpandableMenuItem isDefaultExpanded>
							<ExpandableMenuItemTrigger elemBefore={filterIcon} actionsOnHover={<MoreAction />}>
								Filters
							</ExpandableMenuItemTrigger>
							<ExpandableMenuItemContent>
								<MenuList>
									<LinkMenuItem href="#" elemBefore={searchIcon}>
										Search work items
									</LinkMenuItem>

									<MenuSection isMenuListItem>
										<MenuSectionHeading>Starred</MenuSectionHeading>
										<MenuList>
											<ButtonMenuItem elemBefore={filterIcon}>
												HDS - issues with Rovo label
											</ButtonMenuItem>
										</MenuList>
									</MenuSection>

									<MenuSection isMenuListItem>
										<MenuSectionHeading>Recent</MenuSectionHeading>
										<MenuList>
											<ButtonMenuItem elemBefore={filterIcon}>
												All Component Servicing bugs, issues
											</ButtonMenuItem>
										</MenuList>
									</MenuSection>

									<ExpandableMenuItem isDefaultExpanded>
										<ExpandableMenuItemTrigger>Default filters</ExpandableMenuItemTrigger>
										<ExpandableMenuItemContent>
											<MenuList>
												<ButtonMenuItem elemBefore={filterIcon}>My open work items</ButtonMenuItem>
												<ButtonMenuItem elemBefore={filterIcon}>Reported by me</ButtonMenuItem>
												<ButtonMenuItem elemBefore={filterIcon}>All work items</ButtonMenuItem>
												<ButtonMenuItem elemBefore={filterIcon}>Open work items</ButtonMenuItem>
												<ButtonMenuItem elemBefore={filterIcon}>Done work items</ButtonMenuItem>
												<ButtonMenuItem elemBefore={filterIcon}>Viewed recently</ButtonMenuItem>
												<ButtonMenuItem elemBefore={filterIcon}>Created recently</ButtonMenuItem>
												<ButtonMenuItem elemBefore={filterIcon}>Resolved recently</ButtonMenuItem>
												<ButtonMenuItem elemBefore={filterIcon}>Updated recently</ButtonMenuItem>
											</MenuList>
										</ExpandableMenuItemContent>
									</ExpandableMenuItem>
									<MenuSection isMenuListItem>
										<MenuList>
											<ButtonMenuItem elemBefore={filterIcon}>View all filters</ButtonMenuItem>
										</MenuList>
									</MenuSection>
								</MenuList>
							</ExpandableMenuItemContent>
						</ExpandableMenuItem>

						<ExpandableMenuItem>
							<ExpandableMenuItemTrigger
								elemBefore={<DashboardIcon label="" color="currentColor" />}
								actionsOnHover={
									<>
										<AddAction />
										<MoreAction />
									</>
								}
							>
								Dashboards
							</ExpandableMenuItemTrigger>
							<ExpandableMenuItemContent>
								<MenuList>
									<ButtonMenuItem>Dashboard 1</ButtonMenuItem>
								</MenuList>
							</ExpandableMenuItemContent>
						</ExpandableMenuItem>

						<ExpandableMenuItem>
							<ExpandableMenuItemTrigger elemBefore={<ShieldIcon label="" color="currentColor" />}>
								Operations
							</ExpandableMenuItemTrigger>
							<ExpandableMenuItemContent>
								<MenuList>
									<ButtonMenuItem>Operation 1</ButtonMenuItem>
								</MenuList>
							</ExpandableMenuItemContent>
						</ExpandableMenuItem>

						<TopLevelSpacer />

						<MenuSection isMenuListItem>
							<MenuList>
								<LinkMenuItem
									href="#"
									elemBefore={<ConfluenceIcon label="" shouldUseNewLogoDesign size="xsmall" />}
									elemAfter={<LinkExternalIcon label="" size="small" />}
								>
									Confluence
								</LinkMenuItem>
								<LinkMenuItem
									href="#"
									elemBefore={<AssetsGraph label="" color="currentColor" spacing="spacious" />}
									elemAfter={<LinkExternalIcon label="" size="small" />}
								>
									Assets
								</LinkMenuItem>
								<LinkMenuItem
									href="#"
									elemBefore={<TeamsIcon label="" color="currentColor" />}
									elemAfter={<LinkExternalIcon label="" size="small" />}
								>
									Teams
								</LinkMenuItem>
							</MenuList>
						</MenuSection>

						<TopLevelSpacer />

						<ButtonMenuItem elemBefore={<CustomizeIcon label="" color="currentColor" />}>
							Customize sidebar
						</ButtonMenuItem>
					</MenuList>
				</SideNavContent>
				<SideNavPanelSplitter label="Resize side nav" tooltipContent="Double click to collapse" />
			</SideNav>
		</Root>
	);
}
