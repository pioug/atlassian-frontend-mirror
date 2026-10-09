import React from 'react';

import { JiraServiceManagementIcon } from '@atlaskit/logo/jira-service-management-icon';
import { JiraServiceManagementLogoCS as JiraServiceManagementLogo } from '@atlaskit/logo/jira-service-management/logo';

import LogoTable from '../utils/logo-table';

export default (): React.JSX.Element => (
	<LogoTable
		logo={<JiraServiceManagementLogo appearance="brand" />}
		icon={<JiraServiceManagementIcon appearance="brand" />}
	/>
);
