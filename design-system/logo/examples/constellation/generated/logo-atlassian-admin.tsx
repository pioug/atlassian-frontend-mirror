import React from 'react';

import { AtlassianAdminIcon, AtlassianAdminLogo } from '@atlaskit/logo';

import LogoTable from '../utils/logo-table';

export default function LogoAtlassianAdmin() {
	return (
		<LogoTable
			Logo={<AtlassianAdminLogo appearance="brand" shouldUseNewLogoDesign />}
			Icon={<AtlassianAdminIcon appearance="brand" shouldUseNewLogoDesign />}
		/>
	);
}
