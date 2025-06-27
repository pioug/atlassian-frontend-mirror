import React from 'react';

import { CustomerServiceManagementIcon, CustomerServiceManagementLogo } from '@atlaskit/logo';

import LogoTable from '../utils/logo-table';

export default () => (
	<LogoTable
		Logo={<CustomerServiceManagementLogo appearance="brand" />}
		Icon={<CustomerServiceManagementIcon appearance="brand" />}
	/>
);
