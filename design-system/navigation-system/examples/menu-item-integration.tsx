/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { jsx } from '@compiled/react';

import { IconButton } from '@atlaskit/button/new';
import { cssMap } from '@atlaskit/css';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import Heading from '@atlaskit/heading';
import AlignTextLeftIcon from '@atlaskit/icon/core/align-text-left';
import AppsIcon from '@atlaskit/icon/core/apps';
import BoardIcon from '@atlaskit/icon/core/board';
import BoardsIcon from '@atlaskit/icon/core/boards';
import ClockIcon from '@atlaskit/icon/core/clock';
import FilterIcon from '@atlaskit/icon/core/filter';
import InboxIcon from '@atlaskit/icon/core/inbox';
import MagicWandIcon from '@atlaskit/icon/core/magic-wand';
import ProjectIcon from '@atlaskit/icon/core/project';
import ScalesIcon from '@atlaskit/icon/core/scales';
import ShowMoreHorizontal from '@atlaskit/icon/core/show-more-horizontal';
import StarUnstarredIcon from '@atlaskit/icon/core/star-unstarred';
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
import { Stack } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

const headingStyles = cssMap({
	root: {
		paddingInline: token('space.300'),
		paddingBlockStart: token('space.300'),
	},
});

export default function MenuItemIntegrationExample() {
	return (
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

			<SideNav label="Side navigation">
				<SideNavContent>
					<MenuList>
						<LinkMenuItem href="#" elemBefore={<InboxIcon label="" color="currentColor" />}>
							Your work
						</LinkMenuItem>
						<LinkMenuItem href="#" elemBefore={<AppsIcon label="" color="currentColor" />}>
							Apps
						</LinkMenuItem>

						<ExpandableMenuItem>
							<ExpandableMenuItemTrigger elemBefore={<ProjectIcon label="" color="currentColor" />}>
								Projects
							</ExpandableMenuItemTrigger>
							<ExpandableMenuItemContent>
								<ButtonMenuItem elemBefore={<ScalesIcon label="" color="currentColor" />}>
									Blueshift
								</ButtonMenuItem>
								<ExpandableMenuItem>
									<ExpandableMenuItemTrigger
										elemBefore={<MagicWandIcon label="" color="currentColor" />}
									>
										DST - Claret
									</ExpandableMenuItemTrigger>
									<ExpandableMenuItemContent>
										<ButtonMenuItem elemBefore={<BoardIcon label="" color="currentColor" />}>
											Navigation
										</ButtonMenuItem>
										<ButtonMenuItem elemBefore={<BoardsIcon label="" color="currentColor" />}>
											View all boards
										</ButtonMenuItem>
									</ExpandableMenuItemContent>
								</ExpandableMenuItem>
							</ExpandableMenuItemContent>
						</ExpandableMenuItem>

						<FlyoutMenuItem>
							<FlyoutMenuItemTrigger elemBefore={<ClockIcon label="" color="currentColor" />}>
								Recent
							</FlyoutMenuItemTrigger>
							<FlyoutMenuItemContent>
								<MenuList>
									<ButtonMenuItem elemBefore={<BoardIcon label="" color="currentColor" />}>
										YNG board
									</ButtonMenuItem>
									<Divider />
									<ButtonMenuItem elemBefore={<AlignTextLeftIcon label="" color="currentColor" />}>
										View all recent items
									</ButtonMenuItem>
								</MenuList>
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
											label="Open"
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
				</SideNavContent>
				<PanelSplitter label="Resize sidebar" />
			</SideNav>

			<Main id="main-container">
				<Stack space="space.100" xcss={headingStyles.root}>
					<Heading size="small">Settings</Heading>
				</Stack>
			</Main>
		</Root>
	);
}
