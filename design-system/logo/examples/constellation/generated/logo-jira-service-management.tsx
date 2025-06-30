import React from 'react';

import { JiraServiceManagementIcon, JiraServiceManagementLogo } from '@atlaskit/logo';

import LogoTable from '../utils/logo-table';

export default () => (
	<LogoTable
		logo={<JiraServiceManagementLogo appearance="brand" shouldUseNewLogoDesign />}
		icon={<JiraServiceManagementIcon appearance="brand" shouldUseNewLogoDesign />}
	/>
);
