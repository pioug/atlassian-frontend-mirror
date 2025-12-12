import React from 'react';

import {
	JiraServiceManagementDataCenterIcon,
	JiraServiceManagementDataCenterLogo,
} from '@atlaskit/logo';

import LogoTable from '../utils/logo-table';

export default (): React.JSX.Element => (
	<LogoTable
		logo={<JiraServiceManagementDataCenterLogo appearance="brand" />}
		icon={<JiraServiceManagementDataCenterIcon appearance="brand" />}
	/>
);
