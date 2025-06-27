import React from 'react';

import { JiraServiceManagementIcon, JiraServiceManagementLogo } from '@atlaskit/logo';

import LogoTable from '../utils/logo-table';

export default () => (
	<LogoTable
		Logo={<JiraServiceManagementLogo appearance="brand" shouldUseNewLogoDesign />}
		Icon={<JiraServiceManagementIcon appearance="brand" shouldUseNewLogoDesign />}
	/>
);
