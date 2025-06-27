import React from 'react';

import { JiraAlignIcon, JiraAlignLogo } from '@atlaskit/logo';

import LogoTable from '../utils/logo-table';

export default function LogoJiraAlign() {
	return (
		<LogoTable
			Logo={<JiraAlignLogo appearance="brand" shouldUseNewLogoDesign />}
			Icon={<JiraAlignIcon appearance="brand" shouldUseNewLogoDesign />}
		/>
	);
}
