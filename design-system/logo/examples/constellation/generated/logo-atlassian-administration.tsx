import React from 'react';

import { AtlassianAdministrationIcon, AtlassianAdministrationLogo } from '@atlaskit/logo';

import LogoTable from '../utils/logo-table';

export default function LogoAtlassianAdministration() {
	return (
		<LogoTable
			Logo={<AtlassianAdministrationLogo appearance="brand" shouldUseNewLogoDesign />}
			Icon={<AtlassianAdministrationIcon appearance="brand" shouldUseNewLogoDesign />}
		/>
	);
}
