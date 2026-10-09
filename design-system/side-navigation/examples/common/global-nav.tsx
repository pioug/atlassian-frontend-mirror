import React from 'react';

// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { AppSwitcher } from '@atlaskit/atlassian-navigation/app-switcher';
// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { AtlassianNavigation } from '@atlaskit/atlassian-navigation/atlassian-navigation';
// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import { ProductHome } from '@atlaskit/atlassian-navigation/product-home';
import { AtlassianIcon } from '@atlaskit/logo/atlassian-icon';
import { AtlassianLogo } from '@atlaskit/logo/atlassian/logo';

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
