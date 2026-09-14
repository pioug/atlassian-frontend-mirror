import React from 'react';

import { JiraServiceManagementIcon, JiraServiceManagementLogo } from '@atlaskit/logo';

import LogoTable from '../utils/logo-table';

export default (): React.JSX.Element => (
	<LogoTable
		logo={<JiraServiceManagementLogo appearance="brand" />}
		icon={<JiraServiceManagementIcon appearance="brand" />}
	/>
);
