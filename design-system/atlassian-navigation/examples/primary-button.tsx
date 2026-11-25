import React from 'react';

import { AtlassianNavigation } from '@atlaskit/atlassian-navigation/atlassian-navigation';
import { PrimaryButton } from '@atlaskit/atlassian-navigation/primary-button';

export default (): React.JSX.Element => (
	<AtlassianNavigation
		label="site"
		renderProductHome={() => null}
		primaryItems={[
			<PrimaryButton key="explore">Explore</PrimaryButton>,
			<PrimaryButton key="work-items">Work items</PrimaryButton>,
			<PrimaryButton key="services">Services</PrimaryButton>,
		]}
	/>
);
