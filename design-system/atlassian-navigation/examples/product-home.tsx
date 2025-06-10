import React from 'react';

import { AtlassianNavigation, ProductHome } from '@atlaskit/atlassian-navigation';
import { AtlassianIcon, AtlassianLogo } from '@atlaskit/logo';

const Home = () => (
	<ProductHome href="#" siteTitle="Hello" icon={AtlassianIcon} logo={AtlassianLogo} />
);

export default () => (
	<AtlassianNavigation label="site" renderProductHome={Home} primaryItems={[]} />
);
