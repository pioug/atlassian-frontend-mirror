import React from 'react';

import { AppHome, AtlassianNavigation } from '@atlaskit/atlassian-navigation';
import { JiraIcon } from '@atlaskit/logo';

const ExampleHome = () => (
	<AppHome
		href="#"
		siteTitle="Hello"
		icon={JiraIcon}
		name="Jira"
		aria-label="Visit Jira homepage"
	/>
);

const ProductHomeExample = (): React.JSX.Element => (
	<AtlassianNavigation label="site" renderProductHome={ExampleHome} primaryItems={[]} />
);

export default ProductHomeExample;
