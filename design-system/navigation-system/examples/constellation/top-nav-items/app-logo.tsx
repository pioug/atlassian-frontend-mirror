import React from 'react';

import { JiraIcon } from '@atlaskit/logo';
import { TopNavStart } from '@atlaskit/navigation-system/layout/top-nav';
import { AppLogo } from '@atlaskit/navigation-system/top-nav-items';

import { MockTopBar } from '../common/mock-top-bar';

export const AppLogoExample = () => {
	return (
		<MockTopBar>
			<TopNavStart>
				<AppLogo href="https://jira.atlassian.com" icon={JiraIcon} name="Jira" label="Home page" />
			</TopNavStart>
		</MockTopBar>
	);
};

export default AppLogoExample;
