import React from 'react';

import { AtlassianNavigation, CustomProductHome } from '@atlaskit/atlassian-navigation';

import customIcon from '../shared/assets/atlassian-icon.png';
import customLogo from '../shared/assets/custom-logo-wide.png';

const CustomHome = () => (
	<CustomProductHome
		href="#"
		iconAlt="Atlassian documentation home"
		iconUrl={customIcon}
		logoAlt="Atlassian documentation home"
		logoUrl={customLogo}
		logoMaxWidth={300}
	/>
);

const CustomHomeExample = () => (
	<AtlassianNavigation label="site" renderProductHome={CustomHome} primaryItems={[]} />
);

export default CustomHomeExample;
