import React from 'react';

import Badge from '@atlaskit/badge';
import ClockIcon from '@atlaskit/icon/core/migration/clock--recent';
import HomeIcon from '@atlaskit/icon/core/migration/home';
import PageIcon from '@atlaskit/icon/core/migration/page';
import StarUnstarredIcon from '@atlaskit/icon/core/migration/star-unstarred--star';
import TasksIcon from '@atlaskit/icon/core/tasks';
import SubtaskIcon from '@atlaskit/icon/glyph/subtask';
import { SideNavContent } from '@atlaskit/navigation-system/layout/side-nav';
import { LinkMenuItem } from '@atlaskit/navigation-system/side-nav-items/link-menu-item';
import { MenuList } from '@atlaskit/navigation-system/side-nav-items/menu-list';

import { MockSideNav } from './common/mock-side-nav';

export const LinkMenuItemExample = () => (
	<MockSideNav>
		<SideNavContent>
			<MenuList>
				<LinkMenuItem
					href="#"
					elemBefore={<HomeIcon label="" color="currentColor" spacing="spacious" />}
				>
					Overview
				</LinkMenuItem>
				<LinkMenuItem href="#" elemBefore={<ClockIcon label="" color="currentColor" />}>
					Recent
				</LinkMenuItem>
				<LinkMenuItem href="#" elemBefore={<StarUnstarredIcon label="" color="currentColor" />}>
					Starred
				</LinkMenuItem>
				<LinkMenuItem href="#" elemBefore={<PageIcon label="" color="currentColor" />}>
					Drafts
				</LinkMenuItem>
				<LinkMenuItem
					href="#"
					elemBefore={<TasksIcon label="" color="currentColor" LEGACY_fallbackIcon={SubtaskIcon} />}
					elemAfter={<Badge>{13}</Badge>}
				>
					Tasks
				</LinkMenuItem>
			</MenuList>
		</SideNavContent>
	</MockSideNav>
);
