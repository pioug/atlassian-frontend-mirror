import React from 'react';

import {
	AppHome,
	AppSwitcher,
	AtlassianNavigation,
	generateTheme,
	ProductHome,
	Settings,
} from '@atlaskit/atlassian-navigation';
import { JiraIcon, JiraLogo } from '@atlaskit/logo';
import { fg } from '@atlaskit/platform-feature-flags';

import { DefaultCreate } from './shared/create';
import { defaultPrimaryItems } from './shared/primary-items';

export const JiraProductHome = () =>
	fg('platform-team25-app-icon-tiles') ? (
		<ProductHome testId="jira-home" onClick={console.log} icon={JiraIcon} logo={JiraLogo} />
	) : (
		<AppHome name="Jira" icon={JiraIcon} siteTitle="Extranet" testId="jira-app-home" />
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
