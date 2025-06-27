import React from 'react';

import { JiraWorkManagementIcon, JiraWorkManagementLogo } from '@atlaskit/logo';

import LogoTable from '../utils/logo-table';

export default function LogoJiraWorkManagement() {
	return (
		<LogoTable
			Logo={<JiraWorkManagementLogo appearance="brand" />}
			Icon={<JiraWorkManagementIcon appearance="brand" />}
		/>
	);
}
