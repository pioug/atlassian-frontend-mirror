import React from 'react';

// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { AtlassianNavigation } from '@atlaskit/atlassian-navigation/atlassian-navigation';
// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { Create } from '@atlaskit/atlassian-navigation/create';
// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
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
