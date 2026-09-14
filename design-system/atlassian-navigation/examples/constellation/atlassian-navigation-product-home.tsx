import React from 'react';

// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { AtlassianNavigation, ProductHome } from '@atlaskit/atlassian-navigation';
import { AtlassianIcon } from '@atlaskit/logo/atlassian-icon';
import { AtlassianLogo } from '@atlaskit/logo/atlassian/logo';

const ExampleHome = () => (
	<ProductHome href="#" siteTitle="Hello" icon={AtlassianIcon} logo={AtlassianLogo} />
);

const ProductHomeExample = (): React.JSX.Element => (
	<AtlassianNavigation label="site" renderProductHome={ExampleHome} primaryItems={[]} />
);

export default ProductHomeExample;
