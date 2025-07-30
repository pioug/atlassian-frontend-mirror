/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { jsx } from '@compiled/react';

import Button, { IconButton } from '@atlaskit/button/new';
import { cssMap } from '@atlaskit/css';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import noop from '@atlaskit/ds-lib/noop';
import Heading from '@atlaskit/heading';
import AlignTextLeftIcon from '@atlaskit/icon/core/align-text-left';
import AppsIcon from '@atlaskit/icon/core/apps';
import BoardIcon from '@atlaskit/icon/core/board';
import ClockIcon from '@atlaskit/icon/core/clock';
import FilterIcon from '@atlaskit/icon/core/filter';
import InboxIcon from '@atlaskit/icon/core/inbox';
import ProjectIcon from '@atlaskit/icon/core/project';
import SettingsIcon from '@atlaskit/icon/core/settings';
import ShowMoreHorizontal from '@atlaskit/icon/core/show-more-horizontal';
import StarUnstarredIcon from '@atlaskit/icon/core/star-unstarred';
import { useNotifyOpenLayerObserver } from '@atlaskit/layering/experimental/open-layer-observer';
import { ConfluenceIcon } from '@atlaskit/logo';
import { Main } from '@atlaskit/navigation-system/layout/main';
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
import { MenuList } from '@atlaskit/navigation-system/side-nav-items/menu-list';
import { Divider } from '@atlaskit/navigation-system/side-nav-items/menu-section';
import {
	AppLogo,
	AppSwitcher,
	CreateButton,
	Help,
	Search,
	Settings,
} from '@atlaskit/navigation-system/top-nav-items';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Inline, Stack } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import { WithResponsiveViewport } from './utils/example-utils';
const contentStyles = cssMap({
	root: {
		backgroundColor: token('color.background.brand.subtlest'),
		paddingInline: token('space.300'),
		paddingBlock: token('space.100'),
	},
});

const headingStyles = cssMap({
	root: {
		paddingInline: token('space.300'),
		paddingBlockStart: token('space.300'),
	},
});

// Using a basic element for VR tests to simulate a layered component that adds a flyout lock.
// There are React 18 issues with using popups or dropdown menus in VR tests.
// See: https://atlassian.slack.com/archives/C07G96YU6NQ/p1725320894009059
const MockLayeredComponent = () => {
	useNotifyOpenLayerObserver({
		isOpen: true,
		onClose: noop,
	});
	return <div>Mock layered component</div>;
};

export default function SideNavFlyout({
	isChildLayerOpen = false,
	defaultSideNavCollapsed = false,
}: {
	/**
	 * Whether there is a layered component open within the side nav, which will lock the flyout.
	 */
	isChildLayerOpen?: boolean;
	defaultSideNavCollapsed?: boolean;
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
						<AppSwitcher label="Switch apps" />
						<AppLogo href="" icon={ConfluenceIcon} name="Confluence" label="Home page" />
					</TopNavStart>
					<TopNavMiddle>
						<Search label="Search" />
						<CreateButton>Create</CreateButton>
					</TopNavMiddle>
					<TopNavEnd>
						<Help label="Help" />
						<Settings label="Settings" />
					</TopNavEnd>
				</TopNav>
				<SideNav defaultCollapsed={defaultSideNavCollapsed}>
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
								elemAfter={
									<DropdownMenu
										shouldRenderToParent
										trigger={({ triggerRef: ref, ...props }) => (
											<IconButton
												ref={ref}
												{...props}
												spacing="compact"
												appearance="subtle"
												label="Starred more menu"
												icon={(iconProps) => <ShowMoreHorizontal {...iconProps} size="small" />}
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
								elemAfter={
									<DropdownMenu
										shouldRenderToParent
										trigger={({ triggerRef: ref, ...props }) => (
											<IconButton
												ref={ref}
												{...props}
												spacing="compact"
												appearance="subtle"
												label="Open"
												icon={(iconProps) => <ShowMoreHorizontal {...iconProps} size="small" />}
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

						{isChildLayerOpen && <MockLayeredComponent />}
					</SideNavContent>
					<PanelSplitter label="Resize side nav" />
				</SideNav>
				<Main id="main-container">
					<Stack space="space.100" xcss={headingStyles.root}>
						<Heading size="small">Settings</Heading>
					</Stack>
					<Inline space="space.100" xcss={contentStyles.root}>
						<DropdownMenu
							shouldRenderToParent
							placement="bottom-end"
							trigger={({ triggerRef: ref, ...props }) => (
								<IconButton ref={ref} {...props} label="Settings" icon={SettingsIcon} />
							)}
						>
							<DropdownItemGroup>
								<DropdownItem>Automatic</DropdownItem>
							</DropdownItemGroup>
						</DropdownMenu>
						<Button>Filters</Button>
						<Button>Projects</Button>
						<Inline alignInline="end" grow="fill">
							<DropdownMenu
								shouldRenderToParent
								placement="top-start"
								trigger={({ triggerRef: ref, ...props }) => (
									<IconButton
										ref={ref}
										{...props}
										label="More settings"
										icon={(iconProps) => <ShowMoreHorizontal {...iconProps} size="small" />}
									/>
								)}
							>
								<DropdownItemGroup>
									<DropdownItem>Automatic</DropdownItem>
								</DropdownItemGroup>
							</DropdownMenu>
						</Inline>
					</Inline>
				</Main>
			</Root>
		</WithResponsiveViewport>
	);
}

export function ExpandedVR() {
	return <SideNavFlyout defaultSideNavCollapsed={false} isChildLayerOpen={false} />;
}

export function ExpandedWithOpenLayerVR() {
	return <SideNavFlyout defaultSideNavCollapsed={false} isChildLayerOpen />;
}

export function CollapsedVR() {
	return <SideNavFlyout defaultSideNavCollapsed isChildLayerOpen={false} />;
}

export function CollapsedWithOpenLayerVR() {
	return <SideNavFlyout defaultSideNavCollapsed isChildLayerOpen />;
}
