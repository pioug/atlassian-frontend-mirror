import React from 'react';

import { AtlassianIcon, AtlassianLogo } from '@atlaskit/logo';

import LogoTable from '../utils/logo-table';

export default () => (
	<LogoTable
		logo={<AtlassianLogo appearance="brand" />}
		icon={<AtlassianIcon appearance="brand" />}
	/>
);
