import React from 'react';

import { AtlassianIcon, AtlassianLogo } from '@atlaskit/logo';

import LogoTable from '../utils/logo-table';

export default () => (
	<LogoTable
		Logo={<AtlassianLogo appearance="brand" />}
		Icon={<AtlassianIcon appearance="brand" />}
	/>
);
