import React from 'react';

import { JiraIcon } from '@atlaskit/logo';
import { TopNavStart } from '@atlaskit/navigation-system/layout/top-nav';
import { AppLogo, CustomTitle } from '@atlaskit/navigation-system/top-nav-items';

import { MockTopBar } from '../common/mock-top-bar';

export const CustomTitleExample = () => {
	return (
		<MockTopBar>
			<TopNavStart>
				<AppLogo href="http://www.atlassian.design" icon={JiraIcon} name="Jira" label="Home page" />
				<CustomTitle>Custom title</CustomTitle>
			</TopNavStart>
		</MockTopBar>
	);
};

export default CustomTitleExample;
