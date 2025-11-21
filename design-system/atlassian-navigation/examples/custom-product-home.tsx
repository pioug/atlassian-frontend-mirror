import React from 'react';

import { AtlassianNavigation, CustomProductHome } from '@atlaskit/atlassian-navigation';

import atlassianIconUrl from './shared/assets/atlassian-icon.png';
import atlassianLogoUrl from './shared/assets/atlassian-logo.png';

const ProductHome = () => (
	<CustomProductHome
		href="#"
		iconAlt="Atlassian"
		iconUrl={atlassianIconUrl}
		logoAlt="Atlassian"
		logoUrl={atlassianLogoUrl}
	/>
);

export default (): React.JSX.Element => (
	<AtlassianNavigation label="site" renderProductHome={ProductHome} primaryItems={[]} />
);
