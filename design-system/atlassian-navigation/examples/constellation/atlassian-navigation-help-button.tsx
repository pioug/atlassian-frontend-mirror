import React from 'react';

import { AtlassianNavigation } from '@atlaskit/atlassian-navigation/atlassian-navigation';
import { Help } from '@atlaskit/atlassian-navigation/help';

const HelpButtonExample = (): React.JSX.Element => (
	<AtlassianNavigation
		label="site"
		renderProductHome={() => null}
		renderHelp={() => <Help tooltip="Get help" />}
		primaryItems={[]}
	/>
);

export default HelpButtonExample;
