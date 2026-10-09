import React from 'react';

// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { AtlassianNavigation } from '@atlaskit/atlassian-navigation/atlassian-navigation';
// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { CustomProductHome } from '@atlaskit/atlassian-navigation/custom-product-home';

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

const CustomHomeExample = (): React.JSX.Element => (
	<AtlassianNavigation label="site" renderProductHome={CustomHome} primaryItems={[]} />
);

export default CustomHomeExample;
