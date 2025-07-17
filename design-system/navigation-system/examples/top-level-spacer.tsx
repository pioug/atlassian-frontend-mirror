/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { cssMap, jsx } from '@atlaskit/css';
import AppsIcon from '@atlaskit/icon/core/apps';
import GoalIcon from '@atlaskit/icon/core/goal';
import InboxIcon from '@atlaskit/icon/core/inbox';
import LinkExternalIcon from '@atlaskit/icon/core/link-external';
import ShowMoreHorizontalIcon from '@atlaskit/icon/core/show-more-horizontal';
import { SideNavContent } from '@atlaskit/navigation-system/layout/side-nav';
import { ButtonMenuItem } from '@atlaskit/navigation-system/side-nav-items/button-menu-item';
import { LinkMenuItem } from '@atlaskit/navigation-system/side-nav-items/link-menu-item';
import { MenuList } from '@atlaskit/navigation-system/side-nav-items/menu-list';
import { TopLevelSpacer } from '@atlaskit/navigation-system/side-nav-items/top-level-spacer';

const wrapperStyles = cssMap({
	root: {
		width: '300px',
	},
});

export function TopLevelSpacerExample() {
	return (
		<div css={wrapperStyles.root}>
			<SideNavContent>
				<MenuList>
					<LinkMenuItem href="#" elemBefore={<InboxIcon label="" />}>
						For you
					</LinkMenuItem>
					<LinkMenuItem href="#" elemBefore={<AppsIcon label="" />}>
						Apps
					</LinkMenuItem>

					<TopLevelSpacer />

					<LinkMenuItem
						href="#"
						elemBefore={<GoalIcon label="" />}
						elemAfter={<LinkExternalIcon label="" spacing="spacious" size="small" />}
					>
						Goals
					</LinkMenuItem>

					<TopLevelSpacer />

					<ButtonMenuItem elemBefore={<ShowMoreHorizontalIcon label="" />}>More</ButtonMenuItem>
				</MenuList>
			</SideNavContent>
		</div>
	);
}

export default TopLevelSpacerExample;
