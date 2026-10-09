import React from 'react';

import { CustomerServiceManagementIcon } from '@atlaskit/logo/customer-service-management/icon';
import { CustomerServiceManagementLogoCS as CustomerServiceManagementLogo } from '@atlaskit/logo/customer-service-management/logo';

import LogoTable from '../utils/logo-table';

export default (): React.JSX.Element => (
	<LogoTable
		logo={<CustomerServiceManagementLogo appearance="brand" />}
		icon={<CustomerServiceManagementIcon appearance="brand" />}
	/>
);
