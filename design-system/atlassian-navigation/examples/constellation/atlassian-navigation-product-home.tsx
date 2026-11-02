import React from 'react';

import { AtlassianNavigation } from '@atlaskit/atlassian-navigation/atlassian-navigation';
import { ProductHome } from '@atlaskit/atlassian-navigation/product-home';
import { AtlassianIcon } from '@atlaskit/logo/atlassian-icon';
import { AtlassianLogo } from '@atlaskit/logo/atlassian/logo';

const ExampleHome = () => (
	<ProductHome href="#" siteTitle="Hello" icon={AtlassianIcon} logo={AtlassianLogo} />
);

const ProductHomeExample = (): React.JSX.Element => (
	<AtlassianNavigation label="site" renderProductHome={ExampleHome} primaryItems={[]} />
);

export default ProductHomeExample;
