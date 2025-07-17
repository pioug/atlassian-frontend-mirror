import React from 'react';

import { AtlassianIcon, AtlassianLogo } from '@atlaskit/logo';
import { TopNavEnd, TopNavMiddle, TopNavStart } from '@atlaskit/navigation-system/layout/top-nav';
import {
	AppSwitcher,
	CreateButton,
	Help,
	NavLogo,
	Profile,
	Settings,
} from '@atlaskit/navigation-system/top-nav-items';

import { MockSearch } from '../../utils/mock-search';

export const MockContent = () => {
	return (
		<>
			<TopNavStart>
				<AppSwitcher label="App switcher" />
				<NavLogo
					href="https://www.atlassian.design"
					logo={AtlassianLogo}
					icon={AtlassianIcon}
					label="Home page"
				/>
			</TopNavStart>
			<TopNavMiddle>
				<MockSearch />
				<CreateButton>Create</CreateButton>
			</TopNavMiddle>
			<TopNavEnd>
				<Help label="Help" />
				<Settings label="Settings" />
				<Profile label="Your profile" />
			</TopNavEnd>
		</>
	);
};
