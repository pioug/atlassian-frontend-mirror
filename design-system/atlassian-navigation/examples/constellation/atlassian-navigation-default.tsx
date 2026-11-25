import React from 'react';

import { AtlassianNavigation } from '@atlaskit/atlassian-navigation/atlassian-navigation';
import { PrimaryButton } from '@atlaskit/atlassian-navigation/primary-button';
import { PrimaryDropdownButton } from '@atlaskit/atlassian-navigation/primary-dropdown-button';
import { ProductHome } from '@atlaskit/atlassian-navigation/product-home';
import { AtlassianIcon } from '@atlaskit/logo/atlassian-icon';
import { AtlassianLogo } from '@atlaskit/logo/atlassian/logo';

const AtlassianProductHome = () => <ProductHome icon={AtlassianIcon} logo={AtlassianLogo} />;

const DefaultExample = (): React.JSX.Element => (
	<AtlassianNavigation
		label="site"
		primaryItems={[
			<PrimaryButton key="your-work">Your work</PrimaryButton>,
			<PrimaryDropdownButton key="work-items">Work items</PrimaryDropdownButton>,
			<PrimaryDropdownButton key="projects">Projects</PrimaryDropdownButton>,
			<PrimaryButton key="repositories">Repositories</PrimaryButton>,
		]}
		renderProductHome={AtlassianProductHome}
	/>
);

export default DefaultExample;
