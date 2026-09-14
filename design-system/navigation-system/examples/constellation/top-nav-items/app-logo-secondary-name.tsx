import React from 'react';

import { JiraIcon } from '@atlaskit/logo/jira/icon';
import { TopNavStart } from '@atlaskit/navigation-system/layout/top-nav';
import { AppLogo } from '@atlaskit/navigation-system/top-nav-items';

import { MockTopBar } from '../common/mock-top-bar';

export const AppLogoSecondaryNameExample = (): React.JSX.Element => {
	return (
		<MockTopBar>
			<TopNavStart sideNavToggleButton={null}>
				<AppLogo
					href="https://jira.atlassian.com"
					icon={JiraIcon}
					name="Jira"
					secondaryName="Software development"
					label="Jira home page"
				/>
			</TopNavStart>
		</MockTopBar>
	);
};

export default AppLogoSecondaryNameExample;
