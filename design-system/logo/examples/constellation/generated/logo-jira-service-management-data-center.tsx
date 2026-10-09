import React from 'react';

import { JiraServiceManagementDataCenterIcon } from '@atlaskit/logo/jira-service-management-data-center/icon';
import { JiraServiceManagementDataCenterLogoCS as JiraServiceManagementDataCenterLogo } from '@atlaskit/logo/jira-service-management-data-center/logo';

import LogoTable from '../utils/logo-table';

export default (): React.JSX.Element => (
	<LogoTable
		logo={<JiraServiceManagementDataCenterLogo appearance="brand" />}
		icon={<JiraServiceManagementDataCenterIcon appearance="brand" />}
	/>
);
