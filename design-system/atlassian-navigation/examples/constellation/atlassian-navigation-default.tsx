import React from 'react';

import {
	AtlassianNavigation,
	PrimaryButton,
	PrimaryDropdownButton,
	ProductHome,
} from '@atlaskit/atlassian-navigation';
import { AtlassianIcon, AtlassianLogo } from '@atlaskit/logo';

const AtlassianProductHome = () => <ProductHome icon={AtlassianIcon} logo={AtlassianLogo} />;

const DefaultExample = () => (
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
