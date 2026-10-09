import React from 'react';

// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { AtlassianNavigation } from '@atlaskit/atlassian-navigation/atlassian-navigation';
// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { CustomProductHome } from '@atlaskit/atlassian-navigation/custom-product-home';

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
