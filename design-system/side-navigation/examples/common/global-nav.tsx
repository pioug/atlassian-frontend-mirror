import React from 'react';

import { AppSwitcher, AtlassianNavigation, ProductHome } from '@atlaskit/atlassian-navigation';
import { AtlassianIcon, AtlassianLogo } from '@atlaskit/logo';

const ProductHomeExample = () => <ProductHome icon={AtlassianIcon} logo={AtlassianLogo} />;

const AppSwitcherExample = () => <AppSwitcher tooltip="Switch to..." />;

const GlobalNav = (): React.JSX.Element => (
	<AtlassianNavigation
		label="Atlassian Navigation"
		primaryItems={[]}
		renderProductHome={ProductHomeExample}
		renderAppSwitcher={AppSwitcherExample}
	/>
);

export default GlobalNav;
