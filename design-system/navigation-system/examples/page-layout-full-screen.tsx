/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { useState } from 'react';

import { cssMap, jsx } from '@compiled/react';

import Badge from '@atlaskit/badge';
import AKBanner from '@atlaskit/banner';
import Button from '@atlaskit/button/new';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import Heading from '@atlaskit/heading';
import AppsIcon from '@atlaskit/icon/core/apps';
import GrowDiagonalIcon from '@atlaskit/icon/core/grow-diagonal';
import InboxIcon from '@atlaskit/icon/core/inbox';
import ProjectIcon from '@atlaskit/icon/core/project';
import ShrinkDiagonalIcon from '@atlaskit/icon/core/shrink-diagonal';
import { ConfluenceIcon } from '@atlaskit/logo';
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
import { LinkMenuItem } from '@atlaskit/navigation-system/side-nav-items/link-menu-item';
import { MenuList } from '@atlaskit/navigation-system/side-nav-items/menu-list';
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

const asideStyles = cssMap({
	root: { backgroundColor: token('elevation.surface.sunken') },
	content: {
		paddingTop: token('space.300'),
		paddingRight: token('space.300'),
		paddingBottom: token('space.300'),
		paddingLeft: token('space.300'),
		borderInlineStart: `${token('border.width')} solid ${token('color.border')}`,
	},
});

const panelStyles = cssMap({
	content: {
		paddingTop: token('space.300'),
		paddingRight: token('space.300'),
		paddingBottom: token('space.300'),
		paddingLeft: token('space.300'),
		borderInlineStart: `${token('border.width')} solid ${token('color.border')}`,
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

const scrollableContent = cssMap({
	root: {
		height: '200vh',
	},
});

export default function FullScreenModeExample() {
	const [isPanelVisible, setIsPanelVisible] = useState(true);
	const [isAsideVisible, setIsAsideVisible] = useState(true);
	const [isFullscreen, setIsFullscreen] = useState(false);
	// Simulates a persisted side nav state
	const [defaultSideNavCollapsed, setDefaultSideNavCollapsed] = useState(false);

	return (
		<WithResponsiveViewport>
			<Root>
				{!isFullscreen && (
					<Banner xcss={bannerStyles.root}>
						<AKBanner appearance="announcement">Great news! A new layout system.</AKBanner>
					</Banner>
				)}
				{!isFullscreen && (
					<TopNav>
						<TopNavStart>
							<SideNavToggleButton
								testId="side-nav-toggle-button"
								collapseLabel="Collapse sidebar"
								expandLabel="Expand sidebar"
							/>
							<AppSwitcher label="Switch apps" />
							<AppLogo href="" icon={ConfluenceIcon} name="Confluence" label="Home page" />
						</TopNavStart>
						<TopNavMiddle>
							<Search label="Search" />
							<CreateButton>Create</CreateButton>
						</TopNavMiddle>
						<TopNavEnd>
							<Help label="Help" />
							<Notifications
								label="Notifications"
								badge={() => (
									<Badge max={9} appearance="important">
										{99999}
									</Badge>
								)}
							/>
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
				)}
				{!isFullscreen && (
					<SideNav
						onExpand={() => {
							console.log('onExpand');
							setDefaultSideNavCollapsed(false);
						}}
						onCollapse={() => {
							console.log('onCollapse');
							setDefaultSideNavCollapsed(true);
						}}
						defaultCollapsed={defaultSideNavCollapsed}
					>
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
							</MenuList>
						</SideNavContent>
						<PanelSplitter label="Resize side nav" />
					</SideNav>
				)}
				<Main id="main-container">
					<Stack space="space.100" xcss={headingStyles.root}>
						<Heading size="small">Project Blueshift</Heading>
						<Inline space="space.100">
							<Button
								isDisabled={isFullscreen}
								isSelected={isAsideVisible}
								onClick={() => setIsAsideVisible((prev) => !prev)}
							>
								Toggle aside
							</Button>
							<Button
								isDisabled={isFullscreen}
								isSelected={isPanelVisible}
								onClick={() => setIsPanelVisible((prev) => !prev)}
							>
								Toggle panel
							</Button>
						</Inline>
						<Inline>
							<Button
								isSelected={isFullscreen}
								onClick={() => setIsFullscreen((prev) => !prev)}
								iconBefore={isFullscreen ? ShrinkDiagonalIcon : GrowDiagonalIcon}
							>
								Toggle full screen
							</Button>
						</Inline>
					</Stack>
					<div css={scrollableContent.root} />
				</Main>
				{isAsideVisible && !isFullscreen && (
					<Aside xcss={asideStyles.root} defaultWidth={400}>
						<Stack space="space.400" xcss={asideStyles.content}>
							<Heading size="small">Aside</Heading>
							<Inline space="space.100">
								<Button>Following</Button>
								<Button>Share</Button>
							</Inline>

							<Stack space="space.050">
								<Heading size="small">Owner</Heading>
								<Text weight="medium">Michael Dougall</Text>
							</Stack>
							<div css={scrollableContent.root} />
						</Stack>
						<PanelSplitter label="Resize aside" />
					</Aside>
				)}
				{isPanelVisible && !isFullscreen && (
					<Panel defaultWidth={350}>
						<Stack space="space.200" xcss={panelStyles.content}>
							<Heading size="small">Panel</Heading>
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
							<Text color="color.link">Show 12 more articles</Text>
							<div css={scrollableContent.root} />
						</Stack>
						<PanelSplitter label="Resize panel" />
					</Panel>
				)}
			</Root>
		</WithResponsiveViewport>
	);
}
