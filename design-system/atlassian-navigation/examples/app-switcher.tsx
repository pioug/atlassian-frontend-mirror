import React from 'react';

import { AppSwitcher, AtlassianNavigation } from '@atlaskit/atlassian-navigation';

const DefaultAppSwitcher = () => <AppSwitcher tooltip="Switch to..." />;

export default (): React.JSX.Element => (
	<AtlassianNavigation
		label="site"
		renderProductHome={() => null}
		renderAppSwitcher={DefaultAppSwitcher}
		primaryItems={[]}
	/>
);
