import React from 'react';

import { ConfluenceIcon } from '@atlaskit/logo';
import { SideNavToggleButton } from '@atlaskit/navigation-system/layout/side-nav';
import { TopNavStart } from '@atlaskit/navigation-system/layout/top-nav';
import { AppLogo, AppSwitcher } from '@atlaskit/navigation-system/top-nav-items';

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
				<AppLogo
					href="https://jira.atlassian.com"
					icon={ConfluenceIcon}
					name="Confluence"
					label="Home page"
				/>
			</TopNavStart>
		</MockTopBar>
	);
}

export default TopNavStartLayoutExample;
