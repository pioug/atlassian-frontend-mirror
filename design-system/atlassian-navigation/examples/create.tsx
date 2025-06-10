import React from 'react';

import { AtlassianNavigation, Create, ProductHome } from '@atlaskit/atlassian-navigation';
import { AtlassianIcon, AtlassianLogo } from '@atlaskit/logo';

const CreateButton = () => (
	<Create
		buttonTooltip="I'm shown on bigger viewports"
		iconButtonTooltip="I'm shown when on smaller viewports"
		text="Create"
		onClick={console.log}
		label="Create label"
	/>
);

const Home = () => <ProductHome icon={AtlassianIcon} logo={AtlassianLogo} />;

export default () => (
	<AtlassianNavigation
		label="site"
		renderProductHome={Home}
		renderCreate={CreateButton}
		primaryItems={[]}
	/>
);
