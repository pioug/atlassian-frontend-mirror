import React from 'react';

// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { AppSwitcher } from '@atlaskit/atlassian-navigation/app-switcher';
// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { AtlassianNavigation } from '@atlaskit/atlassian-navigation/atlassian-navigation';

const DefaultAppSwitcher = () => <AppSwitcher tooltip="Switch to..." />;

const AppSwitcherExample = (): React.JSX.Element => (
	<AtlassianNavigation
		label="site"
		renderProductHome={() => null}
		renderAppSwitcher={DefaultAppSwitcher}
		primaryItems={[]}
	/>
);

export default AppSwitcherExample;
