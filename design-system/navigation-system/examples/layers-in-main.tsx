/**
 * @jsxRuntime classic
 * @jsx jsx
 */

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
import { AtlassianIcon, AtlassianLogo } from '@atlaskit/logo';
import { MenuList } from '@atlaskit/navigation-system';
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
import { Divider } from '@atlaskit/navigation-system/side-nav-items/menu-section';
import {
	AppSwitcher,
	CreateButton,
	CustomLogo,
	Help,
	Notifications,
	Search,
	Settings,
} from '@atlaskit/navigation-system/top-nav-items';
import { Inline, Stack, Text } from '@atlaskit/primitives/compiled';
import { PopupSelect } from '@atlaskit/select';
import { token } from '@atlaskit/tokens';

import { WithResponsiveViewport } from './utils/example-utils';

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

const options = [
	{ label: 'accessibility', value: 'accessibility' },
	{ label: 'analytics', value: 'analytics' },
	{ label: 'ktlo', value: 'ktlo' },
	{ label: 'testing', value: 'testing' },
	{ label: 'regression', value: 'regression' },
	{ label: 'layering', value: 'layering' },
	{ label: 'innovation', value: 'innovation' },
	{ label: 'new-feature', value: 'new' },
	{ label: 'existing', value: 'existing' },
	{ label: 'wont-do', value: 'wont-do' },
];

export const LayersInMainShouldForceOpenLayers = () => <LayersInMain shouldForceOpenLayers />;

export default function LayersInMain({
	shouldForceOpenLayers = false,
}: {
	shouldForceOpenLayers?: boolean;
}) {
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
						<CustomLogo href="" logo={AtlassianLogo} icon={AtlassianIcon} label="Home page" />
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
							isOpen={shouldForceOpenLayers || undefined}
							shouldRenderToParent
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
						<PopupSelect
							isOpen={shouldForceOpenLayers || undefined}
							popperProps={{ strategy: 'fixed' }}
							placeholder="Search labels..."
							menuPlacement="bottom"
							options={options}
							target={({ isOpen, ...triggerProps }) => <Button {...triggerProps}>Labels</Button>}
						/>
						<Inline alignInline="end" grow="fill">
							<DropdownMenu
								isOpen={shouldForceOpenLayers || undefined}
								shouldRenderToParent
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
				</Main>
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
					</Stack>
					<PanelSplitter label="Resize panel" />
				</Panel>
			</Root>
		</WithResponsiveViewport>
	);
}
