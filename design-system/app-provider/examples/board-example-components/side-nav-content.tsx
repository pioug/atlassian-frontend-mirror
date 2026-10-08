/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import type { JSX } from 'react';

import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import BoardIcon from '@atlaskit/icon/core/board';
import ClockIcon from '@atlaskit/icon/core/clock';
import CustomizeIcon from '@atlaskit/icon/core/customize';
import InboxIcon from '@atlaskit/icon/core/inbox';
import LinkExternalIcon from '@atlaskit/icon/core/link-external';
import ListBulletedIcon from '@atlaskit/icon/core/list-bulleted';
import ProjectIcon from '@atlaskit/icon/core/project';
import RoadmapIcon from '@atlaskit/icon/core/roadmap';
import ShowMoreVerticalIcon from '@atlaskit/icon/core/show-more-vertical';
import StarUnstarredIcon from '@atlaskit/icon/core/star-unstarred';
import { AssetsIcon } from '@atlaskit/logo/assets/icon';
import { ConfluenceIcon } from '@atlaskit/logo/confluence/icon';
import { GoalsIcon } from '@atlaskit/logo/goals/icon';
import { LoomIcon } from '@atlaskit/logo/loom/icon';
import { TeamsIcon } from '@atlaskit/logo/teams/icon';
import { SideNavBody as SideNavContent } from '@atlaskit/navigation-system/layout/side-nav';
import { Box } from '@atlaskit/primitives/compiled/box';
import { ButtonMenuItem } from '@atlaskit/side-nav-items/button-menu-item';
import {
	ExpandableMenuItem,
	ExpandableMenuItemContent,
	ExpandableMenuItemTrigger,
} from '@atlaskit/side-nav-items/expandable-menu-item';
import { LinkMenuItem } from '@atlaskit/side-nav-items/link-menu-item';
import { MenuList } from '@atlaskit/side-nav-items/menu-list';
import { token } from '@atlaskit/tokens';

import lightBulbOrbitSvg from '../assets/light-bulb-orbit.svg';
import migrationsSvg from '../assets/migrations.svg';
import toggleSvg from '../assets/toggle.svg';
import { HideMenuDropdown, ProjectIconWrapper } from './navigation-components';

const spacingStyles = cssMap({
	marginTop: {
		marginBlockStart: token('space.150'),
	},
});

export const SideNavContentComponent = (): JSX.Element => (
	<SideNavContent>
		<MenuList>
			<LinkMenuItem
				href="#"
				elemBefore={<InboxIcon label="" color="currentColor" />}
				actionsOnHover={<HideMenuDropdown />}
			>
				Your work
			</LinkMenuItem>
			<LinkMenuItem
				href="#"
				elemBefore={<ClockIcon label="" color="currentColor" />}
				actionsOnHover={<HideMenuDropdown />}
			>
				Recent
			</LinkMenuItem>
			<LinkMenuItem
				href="#"
				elemBefore={<StarUnstarredIcon label="" color="currentColor" />}
				actionsOnHover={<HideMenuDropdown />}
			>
				Starred
			</LinkMenuItem>
			<LinkMenuItem
				href="#"
				elemBefore={<RoadmapIcon label="" color="currentColor" />}
				actionsOnHover={<HideMenuDropdown />}
			>
				Plans
			</LinkMenuItem>
			<ExpandableMenuItem isDefaultExpanded>
				<ExpandableMenuItemTrigger elemBefore={<ProjectIcon label="" color="currentColor" />}>
					Projects
				</ExpandableMenuItemTrigger>
				<ExpandableMenuItemContent>
					<LinkMenuItem
						href="#"
						isSelected
						elemBefore={<ProjectIconWrapper color="#BF63F3" imageUrl={lightBulbOrbitSvg} />}
					>
						Growth Discovery
					</LinkMenuItem>
					<ButtonMenuItem
						elemBefore={<ProjectIconWrapper color="#357DE8" imageUrl={migrationsSvg} />}
					>
						Finance
					</ButtonMenuItem>
					<ButtonMenuItem elemBefore={<ProjectIconWrapper color="#FCA700" imageUrl={toggleSvg} />}>
						Marketing
					</ButtonMenuItem>
					<ButtonMenuItem elemBefore={<ListBulletedIcon label="" color="currentColor" />}>
						View all
					</ButtonMenuItem>
				</ExpandableMenuItemContent>
			</ExpandableMenuItem>
			<LinkMenuItem
				href="#"
				elemBefore={<BoardIcon label="" color="currentColor" />}
				actionsOnHover={<HideMenuDropdown />}
			>
				Dashboards
			</LinkMenuItem>
			<LinkMenuItem href="#" elemBefore={<ShowMoreVerticalIcon label="" color="currentColor" />}>
				More
			</LinkMenuItem>
		</MenuList>
		<Box xcss={spacingStyles.marginTop}>
			<MenuList>
				<LinkMenuItem
					href="#"
					elemBefore={<ConfluenceIcon size="xsmall" appearance="brand" label="Confluence" />}
					elemAfter={<LinkExternalIcon label="" size="small" />}
				>
					Confluence
				</LinkMenuItem>
				<LinkMenuItem
					href="#"
					elemBefore={<LoomIcon size="xsmall" appearance="brand" label="Loom" />}
					elemAfter={<LinkExternalIcon label="" size="small" />}
				>
					Loom
				</LinkMenuItem>
				<LinkMenuItem
					href="#"
					elemBefore={<AssetsIcon size="xsmall" appearance="brand" label="Assets" />}
					elemAfter={<LinkExternalIcon label="" size="small" />}
				>
					Assets
				</LinkMenuItem>
				<LinkMenuItem
					href="#"
					elemBefore={<GoalsIcon size="xsmall" appearance="brand" label="Goals" />}
					elemAfter={<LinkExternalIcon label="" size="small" />}
				>
					Goals
				</LinkMenuItem>
				<LinkMenuItem
					href="#"
					elemBefore={<TeamsIcon size="xsmall" appearance="brand" label="Teams" />}
					elemAfter={<LinkExternalIcon label="" size="small" />}
				>
					Teams
				</LinkMenuItem>
			</MenuList>
		</Box>
		<Box xcss={spacingStyles.marginTop}>
			<MenuList>
				<LinkMenuItem href="#" elemBefore={<CustomizeIcon label="" color="currentColor" />}>
					Customize sidebar
				</LinkMenuItem>
			</MenuList>
		</Box>
	</SideNavContent>
);
