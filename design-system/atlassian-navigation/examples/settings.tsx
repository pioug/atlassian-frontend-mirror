import React from 'react';

import { AtlassianNavigation, Settings } from '@atlaskit/atlassian-navigation';

const DefaultSettings = () => <Settings tooltip="Product settings" />;

export default (): React.JSX.Element => (
	<AtlassianNavigation
		label="site"
		renderProductHome={() => null}
		renderSettings={DefaultSettings}
		primaryItems={[]}
	/>
);
