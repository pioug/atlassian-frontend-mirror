import React from 'react';

import { JiraIcon, JiraLogo } from '@atlaskit/logo';
import { TopNavStart } from '@atlaskit/navigation-system/layout/top-nav';
import { NavLogo } from '@atlaskit/navigation-system/top-nav-items';

import { MockTopBar } from '../common/mock-top-bar';

export const NavLogoExample = () => {
	return (
		<MockTopBar>
			<TopNavStart>
				<NavLogo
					href="https://jira.atlassian.com"
					logo={JiraLogo}
					icon={JiraIcon}
					label="Home page"
				/>
			</TopNavStart>
		</MockTopBar>
	);
};

export default NavLogoExample;
