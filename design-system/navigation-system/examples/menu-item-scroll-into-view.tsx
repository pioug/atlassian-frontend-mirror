/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { useState } from 'react';

import { jsx } from '@compiled/react';

import Button from '@atlaskit/button/new';
import { cssMap } from '@atlaskit/css';
import Heading from '@atlaskit/heading';
import AssetsGraph from '@atlaskit/icon-lab/core/assets-graph';
import AlignTextLeftIcon from '@atlaskit/icon/core/align-text-left';
import AppsIcon from '@atlaskit/icon/core/apps';
import BoardIcon from '@atlaskit/icon/core/board';
import ClockIcon from '@atlaskit/icon/core/clock';
import CustomizeIcon from '@atlaskit/icon/core/customize';
import DashboardIcon from '@atlaskit/icon/core/dashboard';
import FilterIcon from '@atlaskit/icon/core/filter';
import InboxIcon from '@atlaskit/icon/core/inbox';
import MegaphoneIcon from '@atlaskit/icon/core/megaphone';
import ProjectIcon from '@atlaskit/icon/core/project';
import ShieldIcon from '@atlaskit/icon/core/shield';
import ShowMoreHorizontalIcon from '@atlaskit/icon/core/show-more-horizontal';
import StarUnstarredIcon from '@atlaskit/icon/core/star-unstarred';
import TeamsIcon from '@atlaskit/icon/core/teams';
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
import { CreateButton, Settings } from '@atlaskit/navigation-system/top-nav-items';
import { token } from '@atlaskit/tokens';

import { WithResponsiveViewport } from './utils/example-utils';

const headingStyles = cssMap({
	root: {
		paddingInline: token('space.300'),
		paddingBlockStart: token('space.300'),
	},
});

// Choosing a subset of menu items to demonstrate the selection + scrollIntoView behaviour, to simplify the example
type SelectableMenuItems = 'your-work' | 'customize' | 'filters' | 'teams' | 'team-10';

export function MenuItemScrollIntoView() {
	const [selectedItem, setSelectedItem] = useState<SelectableMenuItems>('your-work');

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
				<SideNav>
					<SideNavHeader>
						<Heading size="xsmall">Settings</Heading>
					</SideNavHeader>

					<SideNavContent>
						<MenuList>
							<LinkMenuItem
								href="#"
								elemBefore={<InboxIcon label="" color="currentColor" />}
								isSelected={selectedItem === 'your-work'}
								onClick={() => setSelectedItem('your-work')}
							>
								Your work
							</LinkMenuItem>
							<LinkMenuItem href="#" elemBefore={<AppsIcon label="" color="currentColor" />}>
								Apps
							</LinkMenuItem>
							<ExpandableMenuItem isDefaultExpanded>
								<ExpandableMenuItemTrigger
									elemBefore={<ProjectIcon label="" color="currentColor" />}
								>
									Projects
								</ExpandableMenuItemTrigger>
								<ExpandableMenuItemContent>
									{Array.from({ length: 10 }).map((_, index) => (
										<LinkMenuItem
											key={index}
											href="#"
											elemBefore={<BoardIcon label="" color="currentColor" />}
										>
											Project {index + 1}
										</LinkMenuItem>
									))}
								</ExpandableMenuItemContent>
							</ExpandableMenuItem>
							<FlyoutMenuItem>
								<FlyoutMenuItemTrigger elemBefore={<ClockIcon label="" color="currentColor" />}>
									Recent
								</FlyoutMenuItemTrigger>
								<FlyoutMenuItemContent>
									<MenuList>
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
									</MenuList>
								</FlyoutMenuItemContent>
							</FlyoutMenuItem>
							<LinkMenuItem
								href="#"
								elemBefore={<StarUnstarredIcon color="currentColor" label="" />}
							>
								Starred
							</LinkMenuItem>

							<LinkMenuItem href="#" elemBefore={<DashboardIcon color="currentColor" label="" />}>
								Dashboards
							</LinkMenuItem>
							<LinkMenuItem href="#" elemBefore={<ShieldIcon color="currentColor" label="" />}>
								Operations
							</LinkMenuItem>
							<LinkMenuItem href="#" elemBefore={<AssetsGraph color="currentColor" label="" />}>
								Assets
							</LinkMenuItem>
							<LinkMenuItem
								isSelected={selectedItem === 'filters'}
								onClick={() => setSelectedItem('filters')}
								href="#filters"
								elemBefore={<FilterIcon color="currentColor" label="" />}
							>
								Filters
							</LinkMenuItem>
							<ExpandableMenuItem isDefaultExpanded>
								<ExpandableMenuItemTrigger
									href="#"
									elemBefore={<TeamsIcon label="" />}
									isSelected={selectedItem === 'teams'}
									onClick={() => setSelectedItem('teams')}
									// Used in integration test
									testId="teams-menu-item-trigger"
								>
									Teams
								</ExpandableMenuItemTrigger>
								<ExpandableMenuItemContent>
									{Array.from({ length: 9 }).map((_, index) => (
										<LinkMenuItem
											key={index}
											href="#"
											elemBefore={<BoardIcon label="" color="currentColor" />}
										>
											Team {index + 1}
										</LinkMenuItem>
									))}
									<LinkMenuItem
										href="#"
										elemBefore={<BoardIcon label="" color="currentColor" />}
										isSelected={selectedItem === 'team-10'}
										onClick={() => setSelectedItem('team-10')}
									>
										Team 10
									</LinkMenuItem>
								</ExpandableMenuItemContent>
							</ExpandableMenuItem>

							<LinkMenuItem
								href="#"
								elemBefore={<CustomizeIcon label="" color="currentColor" />}
								isSelected={selectedItem === 'customize'}
								onClick={() => setSelectedItem('customize')}
							>
								Customize
							</LinkMenuItem>
							<LinkMenuItem
								href="#"
								elemBefore={<ShowMoreHorizontalIcon label="" color="currentColor" />}
							>
								More
							</LinkMenuItem>
						</MenuList>
					</SideNavContent>

					<SideNavFooter>
						<MenuList>
							<LinkMenuItem href="#" elemBefore={<MegaphoneIcon label="" color="currentColor" />}>
								Give feedback on the new navigation
							</LinkMenuItem>
						</MenuList>
					</SideNavFooter>
					<PanelSplitter label="Resize side nav" />
				</SideNav>

				<Main id="main-container">
					<div css={headingStyles.root}>
						<Heading size="small">Board settings</Heading>

						<br />

						<Heading size="xsmall">Navigate to:</Heading>
						<Button
							onClick={() => setSelectedItem('your-work')}
							isSelected={selectedItem === 'your-work'}
						>
							Your work
						</Button>
						<Button
							onClick={() => setSelectedItem('filters')}
							isSelected={selectedItem === 'filters'}
						>
							Filters
						</Button>
						<Button
							onClick={() => setSelectedItem('customize')}
							isSelected={selectedItem === 'customize'}
							// Used in integration test
							testId="navigate-to-customize-menu-item"
						>
							Customize
						</Button>

						<Button
							onClick={() => setSelectedItem('teams')}
							isSelected={selectedItem === 'teams'}
							// Used in integration test
							testId="navigate-to-teams-menu-item"
						>
							Teams
						</Button>

						<Button
							onClick={() => setSelectedItem('team-10')}
							isSelected={selectedItem === 'team-10'}
							// Used in integration test
							testId="navigate-to-team-10-menu-item"
						>
							Team 10
						</Button>
					</div>
				</Main>
			</Root>
		</WithResponsiveViewport>
	);
}

export default MenuItemScrollIntoView;
