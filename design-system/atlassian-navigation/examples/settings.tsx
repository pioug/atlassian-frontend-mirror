import React from 'react';

import { AtlassianNavigation, Settings } from '@atlaskit/atlassian-navigation';

const DefaultSettings = () => <Settings tooltip="Product settings" />;

export default () => (
	<AtlassianNavigation
		label="site"
		renderProductHome={() => null}
		renderSettings={DefaultSettings}
		primaryItems={[]}
	/>
);
