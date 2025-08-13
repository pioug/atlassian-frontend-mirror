/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useLayoutEffect } from 'react';

import { jsx } from '@compiled/react';

import Badge from '@atlaskit/badge';
import Button, { IconButton } from '@atlaskit/button/new';
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
import Link from '@atlaskit/link';
import { JiraIcon } from '@atlaskit/logo';
import { MenuList } from '@atlaskit/navigation-system';
import { Aside } from '@atlaskit/navigation-system/layout/aside';
import { Banner } from '@atlaskit/navigation-system/layout/banner';
import { Main } from '@atlaskit/navigation-system/layout/main';
import { Panel } from '@atlaskit/navigation-system/layout/panel';
import { PanelSplitter } from '@atlaskit/navigation-system/layout/panel-splitter';
import { Root } from '@atlaskit/navigation-system/layout/root';
import {
	SideNav,
	SideNavContent,
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
	FlyoutMenuItem,
	FlyoutMenuItemContent,
	FlyoutMenuItemTrigger,
} from '@atlaskit/navigation-system/side-nav-items/flyout-menu-item';
import { LinkMenuItem } from '@atlaskit/navigation-system/side-nav-items/link-menu-item';
import { MenuListItem } from '@atlaskit/navigation-system/side-nav-items/menu-list-item';
import { Divider } from '@atlaskit/navigation-system/side-nav-items/menu-section';
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
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Inline, Stack, Text } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import { WithResponsiveViewport } from './utils/example-utils';
import { MockSearch } from './utils/mock-search';

const asideStyles = cssMap({
	root: { backgroundColor: token('elevation.surface.sunken') },
	content: {
		paddingTop: token('space.300'),
		paddingRight: token('space.300'),
		paddingBottom: token('space.300'),
		paddingLeft: token('space.300'),
	},
});

const contentStyles = cssMap({
	root: {
		backgroundColor: token('color.background.brand.subtlest'),
		paddingInline: token('space.300'),
		paddingBlock: token('space.100'),
	},
});

const panelStyles = cssMap({
	content: {
		paddingTop: token('space.300'),
		paddingRight: token('space.300'),
		paddingBottom: token('space.300'),
		paddingLeft: token('space.300'),
	},
});

const headingStyles = cssMap({
	root: {
		paddingInline: token('space.300'),
		paddingBlockStart: token('space.300'),
	},
});

const bannerStyles = cssMap({
	root: {
		backgroundColor: token('elevation.surface.sunken'),
	},
});

export function UnscrollableVR() {
	return (
		<Composition
			defaultMenuIsOpen
			isPanelVisible
			isSlotsScrollable={false}
			shouldTestScroll={false}
			isMockProductSearch={false}
		/>
	);
}

export function ScrollableVR() {
	return (
		<Composition
			defaultMenuIsOpen
			isPanelVisible
			isSlotsScrollable
			shouldTestScroll={false}
			isMockProductSearch={false}
		/>
	);
}

export function ScrollableScrolledVR() {
	return (
		<Composition
			defaultMenuIsOpen
			isPanelVisible
			isSlotsScrollable
			shouldTestScroll
			isMockProductSearch={false}
		/>
	);
}

export function UnscrollableNoPanelVR() {
	return (
		<Composition
			defaultMenuIsOpen
			isPanelVisible={false}
			isSlotsScrollable={false}
			shouldTestScroll={false}
			isMockProductSearch={false}
		/>
	);
}

export function ScrollableNoPanelVR() {
	return (
		<Composition
			defaultMenuIsOpen
			isPanelVisible={false}
			isSlotsScrollable
			shouldTestScroll={false}
			isMockProductSearch={false}
		/>
	);
}

/**
 * Same as the default composition example but:
 *
 * - without the scrolling demonstration
 * - with a mocked product search
 *
 * We don't want the really tall element on the page for VRs because it makes the snapshot very tall.
 */
export function CompositionVR() {
	return <Composition isSlotsScrollable={false} isMockProductSearch />;
}

export default function Composition({
	isSlotsScrollable = true,
	isPanelVisible = true,
	defaultMenuIsOpen = false,
	shouldTestScroll = false,
	isMockProductSearch = true,
}: {
	isSlotsScrollable?: boolean;
	defaultMenuIsOpen?: boolean;
	isPanelVisible?: boolean;
	shouldTestScroll?: boolean;
	/**
	 * Whether to use a mocked product search instead of the original Search component from this package.
	 *
	 * Adding this now because the original Search component has a max width of `680px` which is not desirable
	 * for some new snapshots.
	 *
	 * We should update / remove our Search component in the future.
	 */
	isMockProductSearch?: boolean;
}) {
	useLayoutEffect(() => {
		if (!shouldTestScroll) {
			return;
		}

		document.querySelector('#main-container')?.scrollTo({ top: 10000 });
	}, [shouldTestScroll]);

	return (
		<WithResponsiveViewport>
			<Root testId="root">
				<Banner xcss={bannerStyles.root}> </Banner>
				<TopNav>
					<TopNavStart>
						<SideNavToggleButton
							testId="side-nav-toggle-button"
							collapseLabel="Collapse sidebar"
							expandLabel="Expand sidebar"
						/>
						<AppSwitcher label="Switch apps" />
						<AppLogo href="" icon={JiraIcon} name="Confluence" label="Home page" />
					</TopNavStart>
					<TopNavMiddle>
						{isMockProductSearch ? <MockSearch /> : <Search label="Search" />}
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
						{/**
						 * Wrapping the dropdown in a MenuListItem here because we disable the default list item wrapper
						 * around `Profile` with the `isListItem={false}` prop.
						 *
						 * This is because we want the popup to be the sibling of the trigger, inside the same list item.
						 *
						 * If we didn't do this the popup would be outside of the list item, as a direct child of the list.
						 * This causes a11y violations.
						 */}
						<MenuListItem>
							<DropdownMenu
								defaultOpen={defaultMenuIsOpen}
								shouldRenderToParent
								trigger={({ triggerRef: ref, ...props }) => (
									<Profile ref={ref} label="Profile" isListItem={false} {...props} />
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
							<LinkMenuItem href="#" elemBefore={<InboxIcon label="" color="currentColor" />}>
								Your work
							</LinkMenuItem>
							<LinkMenuItem href="#" elemBefore={<AppsIcon label="" color="currentColor" />}>
								Apps
							</LinkMenuItem>
							<LinkMenuItem href="#" elemBefore={<ProjectIcon label="" color="currentColor" />}>
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
							<ButtonMenuItem
								actions={
									<DropdownMenu
										defaultOpen={defaultMenuIsOpen}
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
						</MenuList>
					</SideNavContent>
					<PanelSplitter label="Resize side nav" testId="side-nav-panel-splitter" />
				</SideNav>
				<Main id="main-container">
					<Stack space="space.100" xcss={headingStyles.root}>
						<Heading size="small">Settings</Heading>
					</Stack>
					<Inline space="space.100" xcss={contentStyles.root}>
						<DropdownMenu
							shouldRenderToParent
							defaultOpen={defaultMenuIsOpen}
							placement="bottom-end"
							trigger={({ triggerRef: ref, ...props }) => (
								<IconButton ref={ref} {...props} label="Open" icon={SettingsIcon} />
							)}
						>
							<DropdownItemGroup>
								<DropdownItem>Settings</DropdownItem>
							</DropdownItemGroup>
						</DropdownMenu>
						<Button>Filters</Button>
						<Button>Projects</Button>
						<Inline alignInline="end" grow="fill">
							<DropdownMenu
								shouldRenderToParent
								defaultOpen={defaultMenuIsOpen}
								placement="top-start"
								trigger={({ triggerRef: ref, ...props }) => (
									<IconButton ref={ref} {...props} label="Open" icon={ShowMoreHorizontalCoreIcon} />
								)}
							>
								<DropdownItemGroup>
									<DropdownItem>Show more</DropdownItem>
								</DropdownItemGroup>
							</DropdownMenu>
						</Inline>
					</Inline>
					<div style={{ height: isSlotsScrollable ? '200vh' : undefined }} />
				</Main>
				<Aside xcss={asideStyles.root}>
					<Stack space="space.400" xcss={asideStyles.content}>
						<Inline space="space.100">
							<Button>Following</Button>
							<Button>Share</Button>
						</Inline>

						<Stack space="space.050">
							<Heading size="small">Owner</Heading>
							<Text weight="medium">Michael Dougall</Text>
						</Stack>
					</Stack>
					<div style={{ height: isSlotsScrollable ? '200vh' : undefined }} />
					<PanelSplitter label="Resize aside" />
				</Aside>
				{isPanelVisible && (
					<Panel>
						<Stack space="space.200" xcss={panelStyles.content}>
							<Heading size="small">Help</Heading>
							<Stack space="space.050">
								<Text weight="bold">What is an epic?</Text>
								<Text>Learn what an epic is and how it's displayed in Jira.</Text>
							</Stack>
							<Stack space="space.050">
								<Text weight="bold">What are sprints?</Text>
								<Text>
									Find out what sprints are and why your team might want to use them to predict and
									execute your project's work.
								</Text>
							</Stack>
							<Link href="https://atlassian.design">Show 12 more articles</Link>
							<div style={{ height: isSlotsScrollable ? '200vh' : undefined }} />
						</Stack>
						<PanelSplitter label="Resize panel" />
					</Panel>
				)}
			</Root>
		</WithResponsiveViewport>
	);
}
