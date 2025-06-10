import React from 'react';

import { AtlassianNavigation, PrimaryButton } from '@atlaskit/atlassian-navigation';

const PrimaryButtonExample = () => (
	<AtlassianNavigation
		label="site"
		renderProductHome={() => null}
		primaryItems={[
			<PrimaryButton>Explore</PrimaryButton>,
			<PrimaryButton>Work items</PrimaryButton>,
			<PrimaryButton>Services</PrimaryButton>,
		]}
	/>
);

export default PrimaryButtonExample;
