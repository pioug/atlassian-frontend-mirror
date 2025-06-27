import React from 'react';

import { AtlassianAccessIcon, AtlassianAccessLogo } from '@atlaskit/logo';

import LogoTable from '../utils/logo-table';

export default () => (
	<LogoTable
		Logo={<AtlassianAccessLogo appearance="brand" />}
		Icon={<AtlassianAccessIcon appearance="brand" />}
	/>
);
