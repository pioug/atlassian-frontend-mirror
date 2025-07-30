import React from 'react';

import { ConfluenceIcon } from '@atlaskit/logo';
import { TopNavEnd, TopNavMiddle, TopNavStart } from '@atlaskit/navigation-system/layout/top-nav';
import {
	AppLogo,
	AppSwitcher,
	CreateButton,
	Help,
	Profile,
	Settings,
} from '@atlaskit/navigation-system/top-nav-items';

import { MockSearch } from '../../utils/mock-search';

export const MockContent = () => {
	return (
		<>
			<TopNavStart>
				<AppSwitcher label="App switcher" />
				<AppLogo
					href="https://www.atlassian.design"
					icon={ConfluenceIcon}
					name="Confluence"
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
