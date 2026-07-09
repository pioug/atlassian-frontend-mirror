import React from 'react';

// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { AtlassianNavigation } from '@atlaskit/atlassian-navigation/atlassian-navigation';
import { ProductHome } from '@atlaskit/atlassian-navigation/product-home';
import { AtlassianLogo } from '@atlaskit/logo';
import { AtlassianIcon } from '@atlaskit/logo/atlassian-icon';

const Home = () => (
	<ProductHome href="#" siteTitle="Hello" icon={AtlassianIcon} logo={AtlassianLogo} />
);

export default (): React.JSX.Element => (
	<AtlassianNavigation label="site" renderProductHome={Home} primaryItems={[]} />
);
