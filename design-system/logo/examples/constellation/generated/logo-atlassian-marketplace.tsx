import React from 'react';

import { AtlassianMarketplaceIcon, AtlassianMarketplaceLogo } from '@atlaskit/logo';

import LogoTable from '../utils/logo-table';

export default () => (
	<LogoTable
		Logo={<AtlassianMarketplaceLogo appearance="brand" />}
		Icon={<AtlassianMarketplaceIcon appearance="brand" />}
	/>
);
