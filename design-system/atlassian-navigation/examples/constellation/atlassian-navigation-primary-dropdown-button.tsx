import React from 'react';

import { AtlassianNavigation } from '@atlaskit/atlassian-navigation/atlassian-navigation';
import { PrimaryDropdownButton } from '@atlaskit/atlassian-navigation/primary-dropdown-button';

const PrimaryDropdownExample = (): React.JSX.Element => (
	<AtlassianNavigation
		label="site"
		renderProductHome={() => null}
		primaryItems={[
			<PrimaryDropdownButton>Explore</PrimaryDropdownButton>,
			<PrimaryDropdownButton>Work items</PrimaryDropdownButton>,
			<PrimaryDropdownButton>Services</PrimaryDropdownButton>,
		]}
	/>
);

export default PrimaryDropdownExample;
