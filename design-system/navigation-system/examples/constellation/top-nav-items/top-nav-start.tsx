import React from 'react';

import { JiraIcon, JiraLogo } from '@atlaskit/logo';
import { SideNavToggleButton } from '@atlaskit/navigation-system/layout/side-nav';
import { TopNavStart } from '@atlaskit/navigation-system/layout/top-nav';
import { AppSwitcher, NavLogo } from '@atlaskit/navigation-system/top-nav-items';

import { MockTopBar } from '../common/mock-top-bar';

export function TopNavStartLayoutExample() {
	return (
		<MockTopBar>
			<TopNavStart>
				<SideNavToggleButton
					defaultCollapsed
					collapseLabel="Collapse sidebar"
					expandLabel="Expand sidebar"
				/>
				<AppSwitcher label="App switcher" />
				<NavLogo
					href="https://jira.atlassian.com"
					logo={JiraLogo}
					icon={JiraIcon}
					label="Home page"
				/>
			</TopNavStart>
		</MockTopBar>
	);
}

export default TopNavStartLayoutExample;
