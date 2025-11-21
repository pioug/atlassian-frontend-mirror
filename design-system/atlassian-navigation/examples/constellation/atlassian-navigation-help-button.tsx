import React from 'react';

import { AtlassianNavigation, Help } from '@atlaskit/atlassian-navigation';

const HelpButtonExample = (): React.JSX.Element => (
	<AtlassianNavigation
		label="site"
		renderProductHome={() => null}
		renderHelp={() => <Help tooltip="Get help" />}
		primaryItems={[]}
	/>
);

export default HelpButtonExample;
