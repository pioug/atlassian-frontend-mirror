import React from 'react';

import { CustomerServiceManagementIcon, CustomerServiceManagementLogo } from '@atlaskit/logo';

import LogoTable from '../utils/logo-table';

export default () => (
	<LogoTable
		logo={<CustomerServiceManagementLogo appearance="brand" />}
		icon={<CustomerServiceManagementIcon appearance="brand" />}
	/>
);
