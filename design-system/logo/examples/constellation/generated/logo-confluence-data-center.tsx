import React from 'react';

import { ConfluenceDataCenterIcon, ConfluenceDataCenterLogo } from '@atlaskit/logo';

import LogoTable from '../utils/logo-table';

export default () => (
	<LogoTable
		Logo={<ConfluenceDataCenterLogo appearance="brand" />}
		Icon={<ConfluenceDataCenterIcon appearance="brand" />}
	/>
);
