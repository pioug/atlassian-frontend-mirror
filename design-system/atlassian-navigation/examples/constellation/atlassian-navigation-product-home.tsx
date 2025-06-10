import React from 'react';

import { AtlassianNavigation, ProductHome } from '@atlaskit/atlassian-navigation';
import { JiraIcon, JiraLogo } from '@atlaskit/logo';

const ExampleHome = () => (
	<ProductHome href="#" siteTitle="Hello" icon={JiraIcon} logo={JiraLogo} />
);

const ProductHomeExample = () => (
	<AtlassianNavigation label="site" renderProductHome={ExampleHome} primaryItems={[]} />
);

export default ProductHomeExample;
