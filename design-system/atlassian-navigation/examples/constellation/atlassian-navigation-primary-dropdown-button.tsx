import React from 'react';

import { AtlassianNavigation, PrimaryDropdownButton } from '@atlaskit/atlassian-navigation';

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
