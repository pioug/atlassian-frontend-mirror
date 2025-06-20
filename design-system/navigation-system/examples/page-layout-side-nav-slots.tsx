/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import Heading from '@atlaskit/heading';
import AssetsGraph from '@atlaskit/icon-lab/core/assets-graph';
import AlignTextLeftIcon from '@atlaskit/icon/core/align-text-left';
import AppsIcon from '@atlaskit/icon/core/apps';
import BoardIcon from '@atlaskit/icon/core/board';
import ClockIcon from '@atlaskit/icon/core/clock';
import DashboardIcon from '@atlaskit/icon/core/dashboard';
import FilterIcon from '@atlaskit/icon/core/filter';
import InboxIcon from '@atlaskit/icon/core/inbox';
import MegaphoneIcon from '@atlaskit/icon/core/megaphone';
import ProjectIcon from '@atlaskit/icon/core/project';
import ShieldIcon from '@atlaskit/icon/core/shield';
import ShowMoreHorizontalIcon from '@atlaskit/icon/core/show-more-horizontal';
import StarUnstarredIcon from '@atlaskit/icon/core/star-unstarred';
import TeamsIcon from '@atlaskit/icon/core/teams';
import { MenuList } from '@atlaskit/navigation-system';
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

export function SideNavSlotsExample() {
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
							<LinkMenuItem href="#" elemBefore={<InboxIcon label="" color="currentColor" />}>
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
										<ButtonMenuItem
											key={index}
											elemBefore={<BoardIcon label="" color="currentColor" />}
										>
											Project {index + 1}
										</ButtonMenuItem>
									))}
								</ExpandableMenuItemContent>
							</ExpandableMenuItem>
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
							<ButtonMenuItem elemBefore={<StarUnstarredIcon color="currentColor" label="" />}>
								Starred
							</ButtonMenuItem>
							<ButtonMenuItem elemBefore={<FilterIcon color="currentColor" label="" />}>
								Filters
							</ButtonMenuItem>
							<ButtonMenuItem elemBefore={<DashboardIcon color="currentColor" label="" />}>
								Dashboards
							</ButtonMenuItem>
							<ButtonMenuItem elemBefore={<ShieldIcon color="currentColor" label="" />}>
								Operations
							</ButtonMenuItem>
							<ButtonMenuItem elemBefore={<AssetsGraph color="currentColor" label="" />}>
								Assets
							</ButtonMenuItem>
							<ButtonMenuItem elemBefore={<TeamsIcon color="currentColor" label="" />}>
								Teams
							</ButtonMenuItem>
							<ButtonMenuItem elemBefore={<ShowMoreHorizontalIcon label="" color="currentColor" />}>
								More
							</ButtonMenuItem>
						</MenuList>
					</SideNavContent>

					<SideNavFooter>
						<MenuList>
							<ButtonMenuItem elemBefore={<MegaphoneIcon label="" color="currentColor" />}>
								Give feedback on the new navigation
							</ButtonMenuItem>
						</MenuList>
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

export default SideNavSlotsExample;
