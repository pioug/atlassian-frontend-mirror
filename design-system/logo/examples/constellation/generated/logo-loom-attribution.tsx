import React from 'react';

import { LoomAttributionIcon, LoomAttributionLogo } from '@atlaskit/logo';

import LogoTable from '../utils/logo-table';

export default (): React.JSX.Element => (
	<LogoTable
		logo={<LoomAttributionLogo appearance="brand" />}
		icon={<LoomAttributionIcon appearance="brand" />}
	/>
);
