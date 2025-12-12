import React from 'react';

import { AtlassianAccessIcon, AtlassianAccessLogo } from '@atlaskit/logo';

import LogoTable from '../utils/logo-table';

export default (): React.JSX.Element => (
	<LogoTable
		logo={<AtlassianAccessLogo appearance="brand" />}
		icon={<AtlassianAccessIcon appearance="brand" />}
	/>
);
