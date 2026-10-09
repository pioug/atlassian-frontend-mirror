import React from 'react';

// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { AtlassianNavigation } from '@atlaskit/atlassian-navigation/atlassian-navigation';
// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { CustomProductHome } from '@atlaskit/atlassian-navigation/custom-product-home';
// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { ProductHome } from '@atlaskit/atlassian-navigation/product-home';
import { JiraServiceManagementIcon } from '@atlaskit/logo/jira-service-management-icon';
import { JiraServiceManagementLogoCS as JiraServiceManagementLogo } from '@atlaskit/logo/jira-service-management/logo';

import customIcon from './shared/assets/atlassian-icon.png';
import customLogo from './shared/assets/custom-logo-wide.png';

const Home = () => (
	<ProductHome
		href="#"
		icon={JiraServiceManagementIcon}
		logo={JiraServiceManagementLogo}
		logoMaxWidth={200}
	/>
);

const CustomHome = () => (
	<CustomProductHome
		href="#"
		iconAlt="Atlassian Documentation"
		iconUrl={customIcon}
		logoAlt="Atlassian Documentation"
		logoUrl={customLogo}
		logoMaxWidth={300}
	/>
);

export default (): React.JSX.Element => (
	<>
		<AtlassianNavigation
			label="example of product home with a non-default value for logoMaxWidth"
			renderProductHome={Home}
			primaryItems={[]}
			testId="product-home"
		/>
		<AtlassianNavigation
			label="example of a custom product home with a non-default value for logoMaxWidth"
			renderProductHome={CustomHome}
			primaryItems={[]}
			testId="custom-product-home"
		/>
	</>
);
