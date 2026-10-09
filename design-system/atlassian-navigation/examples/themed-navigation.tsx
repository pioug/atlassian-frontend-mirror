import React from 'react';

// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { AppHome } from '@atlaskit/atlassian-navigation';
// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { AppSwitcher } from '@atlaskit/atlassian-navigation/app-switcher';
// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { AtlassianNavigation } from '@atlaskit/atlassian-navigation/atlassian-navigation';
// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { Settings } from '@atlaskit/atlassian-navigation/settings';
// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { generateTheme } from '@atlaskit/atlassian-navigation/theme-generator';
import { JiraIcon } from '@atlaskit/logo/jira-icon';

import { DefaultCreate } from './shared/create';
import { defaultPrimaryItems } from './shared/primary-items';

export const JiraAppHome = (): React.JSX.Element => (
	<AppHome testId="jira-home" onClick={console.log} icon={JiraIcon} name="Jira" />
);

const theme = generateTheme({
	name: 'high-contrast',
	backgroundColor: '#272727',
	highlightColor: '#E94E34',
});

const ThemingExample = (): React.JSX.Element => (
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
