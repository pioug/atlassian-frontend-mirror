import React from 'react';

import { AtlassianNavigation, Help } from '@atlaskit/atlassian-navigation';

export default () => (
	<AtlassianNavigation
		label="site"
		renderProductHome={() => null}
		renderHelp={() => <Help tooltip="Get help" />}
		primaryItems={[]}
	/>
);
