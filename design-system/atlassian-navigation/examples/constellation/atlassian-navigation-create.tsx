import React from 'react';

import { AtlassianNavigation } from '@atlaskit/atlassian-navigation/atlassian-navigation';
import { Create } from '@atlaskit/atlassian-navigation/create';
import { ProductHome } from '@atlaskit/atlassian-navigation/product-home';
import { JiraIcon } from '@atlaskit/logo/jira-icon';
import { JiraLogoCS as JiraLogo } from '@atlaskit/logo/jira/logo';

const CreateButton = () => (
	<Create
		buttonTooltip="Create a new page"
		iconButtonTooltip="Create a new page"
		text="Create"
		href="#"
	/>
);

const Home = () => <ProductHome icon={JiraIcon} logo={JiraLogo} />;

const CreateButtonExample = (): React.JSX.Element => (
	<AtlassianNavigation
		label="site"
		renderProductHome={Home}
		renderCreate={CreateButton}
		primaryItems={[]}
	/>
);

export default CreateButtonExample;
