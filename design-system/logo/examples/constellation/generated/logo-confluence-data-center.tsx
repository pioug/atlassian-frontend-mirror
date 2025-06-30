import React from 'react';

import { ConfluenceDataCenterIcon, ConfluenceDataCenterLogo } from '@atlaskit/logo';

import LogoTable from '../utils/logo-table';

export default () => (
	<LogoTable
		logo={<ConfluenceDataCenterLogo appearance="brand" />}
		icon={<ConfluenceDataCenterIcon appearance="brand" />}
	/>
);
