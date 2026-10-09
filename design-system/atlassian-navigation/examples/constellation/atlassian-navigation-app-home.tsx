import React from 'react';

// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { AppHome } from '@atlaskit/atlassian-navigation';
// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { AtlassianNavigation } from '@atlaskit/atlassian-navigation/atlassian-navigation';
import { JiraIcon } from '@atlaskit/logo/jira-icon';

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
