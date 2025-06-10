import React from 'react';

import { AtlassianNavigation, Help } from '@atlaskit/atlassian-navigation';

const HelpButtonExample = () => (
	<AtlassianNavigation
		label="site"
		renderProductHome={() => null}
		renderHelp={() => <Help tooltip="Get help" />}
		primaryItems={[]}
	/>
);

export default HelpButtonExample;
