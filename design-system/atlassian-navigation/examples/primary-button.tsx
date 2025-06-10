import React from 'react';

import { AtlassianNavigation, PrimaryButton } from '@atlaskit/atlassian-navigation';

export default () => (
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
