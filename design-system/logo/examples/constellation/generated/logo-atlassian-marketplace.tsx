import React from 'react';

import { AtlassianMarketplaceIcon } from '@atlaskit/logo/atlassian-marketplace/icon';
import { AtlassianMarketplaceLogo } from '@atlaskit/logo/atlassian-marketplace/logo';

import LogoTable from '../utils/logo-table';

export default (): React.JSX.Element => (
	<LogoTable
		logo={<AtlassianMarketplaceLogo appearance="brand" />}
		icon={<AtlassianMarketplaceIcon appearance="brand" />}
	/>
);
