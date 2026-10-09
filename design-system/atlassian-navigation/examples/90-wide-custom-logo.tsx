import React from 'react';

// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { AtlassianNavigation } from '@atlaskit/atlassian-navigation/atlassian-navigation';
// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { CustomProductHome } from '@atlaskit/atlassian-navigation/custom-product-home';

import customIcon from './shared/assets/atlassian-icon.png';
import customLogo from './shared/assets/custom-logo-wide.png';

const CustomHome = () => (
	<CustomProductHome
		href="#"
		iconAlt="Atlassian Documentation"
		iconUrl={customIcon}
		logoAlt="Atlassian Documentation"
		logoUrl={customLogo}
	/>
);

export default (): React.JSX.Element => (
	<>
		<AtlassianNavigation label="site" renderProductHome={CustomHome} primaryItems={[]} />
		<p>Custom logos will get a default max width of 260px applied.</p>
	</>
);
