import React from 'react';

import { AtlassianNavigation, PrimaryButton } from '../../src';

const PrimaryButtonExample = () => (
	<AtlassianNavigation
		label="site"
		renderProductHome={() => null}
		primaryItems={[
			<PrimaryButton>Explore</PrimaryButton>,
			<PrimaryButton>Issues</PrimaryButton>,
			<PrimaryButton>Services</PrimaryButton>,
		]}
	/>
);

export default PrimaryButtonExample;
