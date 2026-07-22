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
			<PrimaryButton>Your work</PrimaryButton>,
			<PrimaryDropdownButton>Work items</PrimaryDropdownButton>,
			<PrimaryDropdownButton>Projects</PrimaryDropdownButton>,
			<PrimaryButton>Repositories</PrimaryButton>,
		]}
		renderProductHome={AtlassianProductHome}
	/>
);

export default DefaultExample;
