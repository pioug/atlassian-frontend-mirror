import React from 'react';

import { AtlassianNavigation } from '@atlaskit/atlassian-navigation/atlassian-navigation';
import { Settings } from '@atlaskit/atlassian-navigation/settings';

const DefaultSettings = () => <Settings tooltip="Product settings" />;

export default (): React.JSX.Element => (
	<AtlassianNavigation
		label="site"
		renderProductHome={() => null}
		renderSettings={DefaultSettings}
		primaryItems={[]}
	/>
);
