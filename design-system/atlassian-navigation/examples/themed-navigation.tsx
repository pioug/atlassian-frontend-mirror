import React from 'react';

import {
	AppHome,
	AppSwitcher,
	AtlassianNavigation,
	generateTheme,
	Settings,
} from '@atlaskit/atlassian-navigation';
import { JiraIcon } from '@atlaskit/logo';

import { DefaultCreate } from './shared/create';
import { defaultPrimaryItems } from './shared/primary-items';

export const JiraAppHome = () => (
	<AppHome testId="jira-home" onClick={console.log} icon={JiraIcon} name="Jira" />
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
		renderProductHome={JiraAppHome}
		renderSettings={() => <Settings testId="settings" tooltip="Settings" />}
		// eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
		theme={theme}
	/>
);

export default ThemingExample;
