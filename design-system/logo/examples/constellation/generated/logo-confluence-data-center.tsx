import React from 'react';

import { ConfluenceDataCenterIcon, ConfluenceDataCenterLogo } from '@atlaskit/logo';

import LogoTable from '../utils/logo-table';

export default (): React.JSX.Element => (
	<LogoTable
		logo={<ConfluenceDataCenterLogo appearance="brand" />}
		icon={<ConfluenceDataCenterIcon appearance="brand" />}
	/>
);
