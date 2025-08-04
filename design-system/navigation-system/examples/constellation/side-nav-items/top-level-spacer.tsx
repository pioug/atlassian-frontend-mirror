import React from 'react';

import AngleBracketsIcon from '@atlaskit/icon/core/angle-brackets';
import LinkExternalIcon from '@atlaskit/icon/core/link-external';
import PagesIcon from '@atlaskit/icon/core/pages';
import MoreIcon from '@atlaskit/icon/core/show-more-horizontal';
import Lozenge from '@atlaskit/lozenge';
import { SideNavContent } from '@atlaskit/navigation-system/layout/side-nav';
import { ButtonMenuItem } from '@atlaskit/navigation-system/side-nav-items/button-menu-item';
import { LinkMenuItem } from '@atlaskit/navigation-system/side-nav-items/link-menu-item';
import { MenuList } from '@atlaskit/navigation-system/side-nav-items/menu-list';
import { TopLevelSpacer } from '@atlaskit/navigation-system/side-nav-items/top-level-spacer';
import { ConfluenceIcon } from '@atlaskit/temp-nav-app-icons/confluence';
import { GoalsIcon } from '@atlaskit/temp-nav-app-icons/goals';
import { JiraIcon } from '@atlaskit/temp-nav-app-icons/jira';
import { TeamsIcon } from '@atlaskit/temp-nav-app-icons/teams';

import { MockSideNav } from './common/mock-side-nav';

const exampleHref = '#example-href';

export function TopLevelSpacerExample() {
	return (
		<MockSideNav>
			<SideNavContent>
				<MenuList>
					<LinkMenuItem
						href={exampleHref}
						elemBefore={<AngleBracketsIcon label="" color="currentColor" spacing="spacious" />}
					>
						Code
					</LinkMenuItem>

					<LinkMenuItem
						href={exampleHref}
						elemBefore={<PagesIcon label="" color="currentColor" spacing="spacious" />}
						elemAfter={<Lozenge>Try</Lozenge>}
					>
						Templates
					</LinkMenuItem>

					<TopLevelSpacer />

					<LinkMenuItem
						href={exampleHref}
						elemBefore={<JiraIcon label="" />}
						elemAfter={<LinkExternalIcon label="" size="small" color="currentColor" />}
					>
						Jira
					</LinkMenuItem>
					<LinkMenuItem
						href={exampleHref}
						elemBefore={<ConfluenceIcon label="" />}
						elemAfter={<LinkExternalIcon label="" size="small" color="currentColor" />}
					>
						Confluence
					</LinkMenuItem>
					<LinkMenuItem
						href={exampleHref}
						elemBefore={<TeamsIcon label="" />}
						elemAfter={<LinkExternalIcon label="" size="small" color="currentColor" />}
					>
						Goals
					</LinkMenuItem>
					<LinkMenuItem
						href={exampleHref}
						elemBefore={<GoalsIcon label="" />}
						elemAfter={<LinkExternalIcon label="" size="small" color="currentColor" />}
					>
						Teams
					</LinkMenuItem>

					<TopLevelSpacer />

					<ButtonMenuItem elemBefore={<MoreIcon label="" />}>More</ButtonMenuItem>
				</MenuList>
			</SideNavContent>
		</MockSideNav>
	);
}

export default TopLevelSpacerExample;
