import React from 'react';

import { AtlassianNavigation, CustomProductHome } from '../src';

import customIcon from './shared/assets/atlassian-icon.png';
import customLogo from './shared/assets/custom-logo-wide.png';

const CustomHome = () => (
	<CustomProductHome
		href="atlassian.design"
		iconAlt="Atlassian Documentation"
		iconUrl={customIcon}
		logoAlt="Atlassian Documentation"
		logoUrl={customLogo}
		logoMaxWidth={300}
	/>
);

export default () => (
	<AtlassianNavigation
		label="example of a custom product home with a non-default value for logoMaxWidth"
		renderProductHome={CustomHome}
		primaryItems={[]}
		testId="custom-product-home"
	/>
);
