import React from 'react';

import {
	AppSwitcher,
	AtlassianNavigation,
	generateTheme,
	ProductHome,
	Settings,
} from '@atlaskit/atlassian-navigation';
import { JiraIcon, JiraLogo } from '@atlaskit/logo';
import { fg } from '@atlaskit/platform-feature-flags';
import {
	JiraIcon as JiraIconTemp,
	JiraLogo as JiraLogoTemp,
} from '@atlaskit/temp-nav-app-icons/jira';

import { DefaultCreate } from './shared/create';
import { defaultPrimaryItems } from './shared/primary-items';

export const JiraProductHome = () => (
	<ProductHome
		testId="jira-home"
		onClick={console.log}
		icon={fg('platform-team25-app-icon-tiles') ? JiraIconTemp : JiraIcon}
		logo={fg('platform-team25-app-icon-tiles') ? JiraLogoTemp : JiraLogo}
	/>
);

const theme = generateTheme({
	name: 'high-contrast',
	backgroundColor: '#272727',
	highlightColor: '#E94E34',
});

const ThemingExample = () => (
	<AtlassianNavigation
		label="site"
		testId="themed"
		renderAppSwitcher={() => <AppSwitcher testId="app-switcher" tooltip="Switch apps" />}
		primaryItems={defaultPrimaryItems.slice(0, 1)}
		renderCreate={DefaultCreate}
		renderProductHome={JiraProductHome}
		renderSettings={() => <Settings testId="settings" tooltip="Settings" />}
		// eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
		theme={theme}
	/>
);

export default ThemingExample;
