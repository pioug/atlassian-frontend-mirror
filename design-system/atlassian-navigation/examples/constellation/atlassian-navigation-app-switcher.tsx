import React from 'react';

import { AppSwitcher, AtlassianNavigation } from '../../src';

const DefaultAppSwitcher = () => <AppSwitcher tooltip="Switch to..." />;

const AppSwitcherExample = () => (
	<AtlassianNavigation
		label="site"
		renderProductHome={() => null}
		renderAppSwitcher={DefaultAppSwitcher}
		primaryItems={[]}
	/>
);

export default AppSwitcherExample;
