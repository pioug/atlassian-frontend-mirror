import React from 'react';

// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { AtlassianNavigation } from '@atlaskit/atlassian-navigation/atlassian-navigation';
// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { Create } from '@atlaskit/atlassian-navigation/create';
// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { ProductHome } from '@atlaskit/atlassian-navigation/product-home';
import { AtlassianIcon } from '@atlaskit/logo/atlassian-icon';
import { AtlassianLogo } from '@atlaskit/logo/atlassian/logo';

const CreateButton = () => (
	<Create
		buttonTooltip="Create a new page"
		iconButtonTooltip="Create a new page"
		text="Create"
		href="#"
	/>
);

const Home = () => <ProductHome icon={AtlassianIcon} logo={AtlassianLogo} />;

export default (): React.JSX.Element => (
	<AtlassianNavigation
		label="site"
		renderProductHome={Home}
		renderCreate={CreateButton}
		primaryItems={[]}
	/>
);
