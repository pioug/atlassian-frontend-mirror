import React from 'react';

import { JiraIcon, JiraLogo } from '@atlaskit/logo';

import { AtlassianNavigation, ProductHome } from '../../src';

const ExampleHome = () => (
	<ProductHome href="#" siteTitle="Hello" icon={JiraIcon} logo={JiraLogo} />
);

const ProductHomeExample = () => (
	<AtlassianNavigation label="site" renderProductHome={ExampleHome} primaryItems={[]} />
);

export default ProductHomeExample;
