/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { useState } from 'react';

import { jsx } from '@compiled/react';

import Badge from '@atlaskit/badge';
import { IconButton } from '@atlaskit/button/new';
import { cssMap } from '@atlaskit/css';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import Heading from '@atlaskit/heading';
import AlignTextLeftIcon from '@atlaskit/icon/core/align-text-left';
import AppsIcon from '@atlaskit/icon/core/apps';
import BoardIcon from '@atlaskit/icon/core/board';
import ClockIcon from '@atlaskit/icon/core/clock';
import FilterIcon from '@atlaskit/icon/core/filter';
import InboxIcon from '@atlaskit/icon/core/inbox';
import ProjectIcon from '@atlaskit/icon/core/project';
import SettingsIcon from '@atlaskit/icon/core/settings';
import ShowMoreHorizontalCoreIcon from '@atlaskit/icon/core/show-more-horizontal';
import StarUnstarredIcon from '@atlaskit/icon/core/star-unstarred';
import { JiraIcon } from '@atlaskit/logo';
import { Banner } from '@atlaskit/navigation-system/layout/banner';
import { Main } from '@atlaskit/navigation-system/layout/main';
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
import Popup from '@atlaskit/popup';
import { ButtonMenuItem } from '@atlaskit/side-nav-items/button-menu-item';
import {
	ExpandableMenuItem,
	ExpandableMenuItemContent,
	ExpandableMenuItemTrigger,
} from '@atlaskit/side-nav-items/expandable-menu-item';
import {
	FlyoutMenuItem,
	FlyoutMenuItemContent,
	FlyoutMenuItemTrigger,
} from '@atlaskit/side-nav-items/flyout-menu-item';
import { LinkMenuItem } from '@atlaskit/side-nav-items/link-menu-item';
import { MenuList } from '@atlaskit/side-nav-items/menu-list';
import { Divider } from '@atlaskit/side-nav-items/menu-section';
import { token } from '@atlaskit/tokens';

import { WithResponsiveViewport } from './utils/example-utils';

const headingStyles = cssMap({
	root: {
		paddingInline: token('space.300'),
		paddingBlockStart: token('space.300'),
		display: 'flex',
		flexDirection: 'column',
		gap: token('space.100'),
	},
});

const bannerStyles = cssMap({
	root: {
		backgroundColor: token('elevation.surface.sunken'),
	},
});

const appSwitcherStyles = cssMap({
	root: {
		width: '400px',
		height: '500px',
		paddingBlockStart: token('space.100'),
		paddingInlineEnd: token('space.100'),
		paddingBlockEnd: token('space.100'),
		paddingInlineStart: token('space.100'),
	},
});

function MockAppSwitcher(): JSX.Element {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Popup
			isOpen={isOpen}
			onClose={() => {
				setIsOpen(false);
			}}
			content={() => <div css={appSwitcherStyles.root}>Mock app switcher</div>}
			placement="bottom-start"
			shouldRenderToParent
			trigger={(triggerProps) => (
				<AppSwitcher
					{...triggerProps}
					onClick={() => {
						setIsOpen((prev) => !prev);
					}}
					label="Switch apps"
					isSelected={isOpen}
				/>
			)}
		/>
	);
}

const createButtonStyles = cssMap({
	root: {
		width: '300px',
		height: '400px',
		paddingBlockStart: token('space.100'),
		paddingInlineEnd: token('space.100'),
		paddingBlockEnd: token('space.100'),
		paddingInlineStart: token('space.100'),
	},
});

function MockCreate(): JSX.Element {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Popup
			isOpen={isOpen}
			onClose={() => {
				setIsOpen(false);
			}}
			content={() => <div css={createButtonStyles.root}>Mock create button</div>}
			placement="bottom-end"
			shouldRenderToParent
			trigger={(triggerProps) => (
				<CreateButton
					{...triggerProps}
					onClick={() => {
						setIsOpen((prev) => !prev);
						console.log('create button clicked');
					}}
					testId="create-button"
				>
					Create
				</CreateButton>
			)}
		/>
	);
}

const notificationsStyles = cssMap({
	root: {
		width: '600px',
		height: '700px',
		paddingBlockStart: token('space.100'),
		paddingInlineEnd: token('space.100'),
		paddingBlockEnd: token('space.100'),
		paddingInlineStart: token('space.100'),
	},
});

function MockNotifications(): JSX.Element {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Popup
			isOpen={isOpen}
			onClose={() => {
				setIsOpen(false);
			}}
			shouldRenderToParent
			content={() => <div css={notificationsStyles.root}>Mock notifications</div>}
			placement="bottom-end"
			trigger={(triggerProps) => (
				<Notifications
					{...triggerProps}
					badge={() => (
						<Badge max={9} appearance="important">
							{99999}
						</Badge>
					)}
					label="Notifications"
					onClick={() => {
						setIsOpen((prev) => !prev);
					}}
				/>
			)}
		/>
	);
}

export function SideNavLayering(): JSX.Element {
	return (
		<WithResponsiveViewport>
			<Root testId="root" isSideNavShortcutEnabled>
				<Banner xcss={bannerStyles.root}> </Banner>
				<TopNav testId="top-nav">
					<TopNavStart
						sideNavToggleButton={
							<SideNavToggleButton
								testId="side-nav-toggle-button"
								collapseLabel="Collapse sidebar"
								expandLabel="Expand sidebar"
							/>
						}
					>
						<MockAppSwitcher />
						<AppLogo href="" icon={JiraIcon} name="Confluence" label="Home page" />
					</TopNavStart>
					<TopNavMiddle>
						<Search label="Search" />
						<MockCreate />
					</TopNavMiddle>
					<TopNavEnd>
						<Help label="Help" onClick={() => console.log('help button clicked')} />
						<MockNotifications />
						<Settings label="Settings" />
						<DropdownMenu
							shouldRenderToParent
							trigger={({ triggerRef: ref, ...props }) => (
								<Profile ref={ref} label="Profile" {...props} />
							)}
						>
							<DropdownItemGroup>
								<DropdownItem>Account</DropdownItem>
							</DropdownItemGroup>
						</DropdownMenu>
					</TopNavEnd>
				</TopNav>
				<SideNav testId="side-nav">
					<SideNavContent>
						<MenuList>
							<LinkMenuItem href="#" elemBefore={<InboxIcon label="" color="currentColor" />}>
								Your work
							</LinkMenuItem>
							<LinkMenuItem href="#" elemBefore={<AppsIcon label="" color="currentColor" />}>
								Apps
							</LinkMenuItem>
							<LinkMenuItem
								href="#"
								elemBefore={<ProjectIcon label="" color="currentColor" />}
								actions={
									<DropdownMenu
										shouldRenderToParent
										trigger={({ triggerRef: ref, ...props }) => (
											<IconButton
												ref={ref}
												{...props}
												spacing="compact"
												appearance="subtle"
												label="Project more options"
												icon={(iconProps) => (
													<ShowMoreHorizontalCoreIcon {...iconProps} size="small" />
												)}
												isTooltipDisabled={false}
											/>
										)}
									>
										<DropdownItemGroup>
											{Array.from({ length: 100 }, (_, i) => (
												<DropdownItem key={i}>Item {i + 1}</DropdownItem>
											))}
										</DropdownItemGroup>
									</DropdownMenu>
								}
							>
								Projects
							</LinkMenuItem>

							<FlyoutMenuItem>
								<FlyoutMenuItemTrigger elemBefore={<ClockIcon label="" color="currentColor" />}>
									Recent
								</FlyoutMenuItemTrigger>
								<FlyoutMenuItemContent>
									<ButtonMenuItem elemBefore={<BoardIcon label="" color="currentColor" />}>
										YNG board
									</ButtonMenuItem>
									<Divider />
									<ButtonMenuItem elemBefore={<AlignTextLeftIcon label="" color="currentColor" />}>
										View all starred items
									</ButtonMenuItem>
								</FlyoutMenuItemContent>
							</FlyoutMenuItem>

							<FlyoutMenuItem>
								<FlyoutMenuItemTrigger testId="tall-flyout-menu-item-trigger">
									Flyout menu item with lots of content
								</FlyoutMenuItemTrigger>
								<FlyoutMenuItemContent>
									{Array.from({ length: 100 }, (_, i) => (
										<LinkMenuItem key={i} href="#" elemBefore={<InboxIcon label="" />}>
											Item {i + 1}
										</LinkMenuItem>
									))}
								</FlyoutMenuItemContent>
							</FlyoutMenuItem>

							<ButtonMenuItem
								actions={
									<DropdownMenu
										shouldRenderToParent
										trigger={({ triggerRef: ref, ...props }) => (
											<IconButton
												ref={ref}
												{...props}
												spacing="compact"
												appearance="subtle"
												label="Open"
												icon={(iconProps) => (
													<ShowMoreHorizontalCoreIcon {...iconProps} size="small" />
												)}
												isTooltipDisabled={false}
											/>
										)}
									>
										<DropdownItemGroup>
											<DropdownItem>Manage starred</DropdownItem>
										</DropdownItemGroup>
									</DropdownMenu>
								}
								elemBefore={<StarUnstarredIcon color="currentColor" label="" />}
							>
								Starred
							</ButtonMenuItem>
							<ButtonMenuItem
								actions={
									<DropdownMenu
										shouldRenderToParent
										trigger={({ triggerRef: ref, ...props }) => (
											<IconButton
												ref={ref}
												{...props}
												spacing="compact"
												appearance="subtle"
												label="Open"
												icon={(iconProps) => (
													<ShowMoreHorizontalCoreIcon {...iconProps} size="small" />
												)}
												isTooltipDisabled={false}
											/>
										)}
									>
										<DropdownItemGroup>
											<DropdownItem>Manage filters</DropdownItem>
										</DropdownItemGroup>
									</DropdownMenu>
								}
								elemBefore={<FilterIcon color="currentColor" label="" />}
							>
								Filters
							</ButtonMenuItem>

							<ExpandableMenuItem>
								<ExpandableMenuItemTrigger>
									Expandable menu item with long content
								</ExpandableMenuItemTrigger>
								<ExpandableMenuItemContent>
									{Array.from({ length: 100 }, (_, i) => (
										<LinkMenuItem key={i} href="#" elemBefore={<InboxIcon label="" />}>
											Item {i + 1}
										</LinkMenuItem>
									))}
								</ExpandableMenuItemContent>
							</ExpandableMenuItem>
						</MenuList>
					</SideNavContent>
					<SideNavPanelSplitter
						label="Resize side nav"
						testId="side-nav-panel-splitter"
						tooltipContent="Double click to collapse"
					/>
				</SideNav>
				<Main id="main-container">
					<div css={headingStyles.root}>
						<Heading size="small">Settings</Heading>

						<IconButton label="Configure settings" icon={SettingsIcon} />
					</div>
				</Main>
			</Root>
		</WithResponsiveViewport>
	);
}

export default SideNavLayering;
