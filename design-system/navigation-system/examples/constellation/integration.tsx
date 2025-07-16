import React, { useReducer } from 'react';

import Breadcrumbs, { BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import { IconButton } from '@atlaskit/button/new';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import Heading from '@atlaskit/heading';
import CloseIcon from '@atlaskit/icon/core/migration/close--cross';
import NotificationIcon from '@atlaskit/icon/core/migration/notification';
import PageIcon from '@atlaskit/icon/core/migration/page';
import PersonIcon from '@atlaskit/icon/core/migration/person';
import ProjectIcon from '@atlaskit/icon/core/project';
import IssuesIcon from '@atlaskit/icon/glyph/issues';
import { JiraIcon, JiraLogo } from '@atlaskit/logo';
import { LinkItem, MenuGroup, Section } from '@atlaskit/menu';
import {
	CreateButton,
	Help,
	NavLogo,
	Root,
	SideNav,
	SideNavContent,
	SideNavFooter,
} from '@atlaskit/navigation-system';
import { Aside } from '@atlaskit/navigation-system/layout/aside';
import { Main } from '@atlaskit/navigation-system/layout/main';
import { Panel } from '@atlaskit/navigation-system/layout/panel';
import { PanelSplitter } from '@atlaskit/navigation-system/layout/panel-splitter';
import { SideNavToggleButton } from '@atlaskit/navigation-system/layout/side-nav';
import {
	TopNav,
	TopNavEnd,
	TopNavMiddle,
	TopNavStart,
} from '@atlaskit/navigation-system/layout/top-nav';
import {
	ExpandableMenuItem,
	ExpandableMenuItemContent,
	ExpandableMenuItemTrigger,
} from '@atlaskit/navigation-system/side-nav-items/expandable-menu-item';
import { LinkMenuItem } from '@atlaskit/navigation-system/side-nav-items/link-menu-item';
import { MenuList } from '@atlaskit/navigation-system/side-nav-items/menu-list';
import { Search, Settings } from '@atlaskit/navigation-system/top-nav-items';
import PageHeader from '@atlaskit/page-header';
import { Popup, PopupContent, PopupTrigger } from '@atlaskit/popup/experimental';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, Inline, Stack } from '@atlaskit/primitives';
import Skeleton from '@atlaskit/skeleton';

export const IntegrationLayoutExample = () => {
	const [isPanelVisible, toggleIsPanelVisible] = useReducer((isVisible) => !isVisible, true);
	const [isSettingsOpen, toggleIsSettingsOpen] = useReducer((isOpen) => !isOpen, false);

	return (
		<Root>
			<TopNav>
				<TopNavStart>
					<SideNavToggleButton collapseLabel="Collapse sidebar" expandLabel="Expand sidebar" />
					<NavLogo
						href="https://jira.atlassian.com"
						logo={JiraLogo}
						icon={JiraIcon}
						label="Home page"
					/>
				</TopNavStart>
				<TopNavMiddle>
					<Search label="Search" />
					<CreateButton>Create</CreateButton>
				</TopNavMiddle>
				<TopNavEnd>
					<Help label="Help" onClick={toggleIsPanelVisible} />
					<Popup isOpen={isSettingsOpen}>
						<PopupTrigger>
							{({ ref }) => <Settings ref={ref} onClick={toggleIsSettingsOpen} label="Settings" />}
						</PopupTrigger>
						<PopupContent onClose={toggleIsSettingsOpen} placement="bottom">
							{() => (
								<MenuGroup>
									<Section title="Personal Jira settings">
										<LinkItem
											href="/"
											description="Manage language, time zone, and other personal preferences"
											iconBefore={<PersonIcon label="" color="currentColor" />}
										>
											General settings
										</LinkItem>
										<LinkItem
											href="/"
											description="Manage email and in-product notifications from Jira"
											iconBefore={<NotificationIcon label="" color="currentColor" />}
										>
											Notification settings
										</LinkItem>
									</Section>
									<Section title="Atlassian admin settings">
										<LinkItem
											href="/"
											description="Update your billing details, manage subscriptions, and more"
											iconBefore={<PageIcon label="" color="currentColor" />}
										>
											Billing
										</LinkItem>
									</Section>
								</MenuGroup>
							)}
						</PopupContent>
					</Popup>
				</TopNavEnd>
			</TopNav>
			<SideNav defaultWidth={100}>
				<SideNavContent>
					<MenuList>
						<LinkMenuItem href="#">Your work</LinkMenuItem>
						<ExpandableMenuItem isDefaultExpanded>
							<ExpandableMenuItemTrigger
								elemBefore={
									<ProjectIcon label="" LEGACY_fallbackIcon={IssuesIcon} color="currentColor" />
								}
							>
								Projects
							</ExpandableMenuItemTrigger>
							<ExpandableMenuItemContent>
								<LinkMenuItem href="#" isSelected>
									Design System
								</LinkMenuItem>
							</ExpandableMenuItemContent>
						</ExpandableMenuItem>
					</MenuList>
				</SideNavContent>
				<SideNavFooter>Give feedback</SideNavFooter>
				<PanelSplitter label="Resize side nav" />
			</SideNav>
			<Main>
				<Box paddingInline="space.300">
					<PageHeader
						breadcrumbs={
							<Breadcrumbs>
								<BreadcrumbsItem text="Projects" key="Projects" />
								<BreadcrumbsItem text="Design System" key="Design System" />
							</Breadcrumbs>
						}
					>
						Issue name
					</PageHeader>
					<Stack space="space.300">
						<Stack space="space.100">
							<Skeleton width="100%" height={16} borderRadius={3} />
							<Skeleton width="100%" height={16} borderRadius={3} />
							<Skeleton width="66%" height={16} borderRadius={3} />
						</Stack>
						<Stack space="space.100">
							<Skeleton width="100%" height={16} borderRadius={3} />
							<Skeleton width="100%" height={16} borderRadius={3} />
							<Skeleton width="100%" height={16} borderRadius={3} />
							<Skeleton width="33%" height={16} borderRadius={3} />
						</Stack>
					</Stack>
				</Box>
			</Main>
			<Aside defaultWidth={100}>
				<Box paddingBlock="space.300">
					<DropdownMenu trigger="To do" shouldRenderToParent>
						<DropdownItemGroup>
							<DropdownItem>To do</DropdownItem>
							<DropdownItem>In progress</DropdownItem>
							<DropdownItem>Done</DropdownItem>
						</DropdownItemGroup>
					</DropdownMenu>
				</Box>
			</Aside>
			{isPanelVisible && (
				<Panel defaultWidth={200}>
					<Box padding="space.150">
						<Stack space="space.200">
							<Inline alignBlock="center" spread="space-between">
								<Heading size="small" as="h2">
									Help
								</Heading>
								<IconButton
									icon={CloseIcon}
									label=""
									appearance="subtle"
									onClick={toggleIsPanelVisible}
								/>
							</Inline>
							<Stack space="space.300">
								<Stack space="space.100">
									<Skeleton width="100%" height={16} borderRadius={3} />
									<Skeleton width="100%" height={16} borderRadius={3} />
									<Skeleton width="66%" height={16} borderRadius={3} />
								</Stack>
								<Stack space="space.100">
									<Skeleton width="100%" height={16} borderRadius={3} />
									<Skeleton width="100%" height={16} borderRadius={3} />
									<Skeleton width="100%" height={16} borderRadius={3} />
									<Skeleton width="33%" height={16} borderRadius={3} />
								</Stack>
							</Stack>
						</Stack>
					</Box>
				</Panel>
			)}
		</Root>
	);
};
