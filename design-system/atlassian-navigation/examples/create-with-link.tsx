import React from 'react';

import { AtlassianNavigation, Create, ProductHome } from '@atlaskit/atlassian-navigation';
import { AtlassianIcon, AtlassianLogo } from '@atlaskit/logo';

const CreateButton = () => (
	<Create
		buttonTooltip="Create a new page"
		iconButtonTooltip="Create a new page"
		text="Create"
		href="#"
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
