import React from 'react';

import { AtlassianIcon, AtlassianLogo } from '@atlaskit/logo';

import { AtlassianNavigation, PrimaryButton, PrimaryDropdownButton, ProductHome } from '../../src';

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
