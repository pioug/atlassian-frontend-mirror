import React from 'react';

import { AtlassianAnalyticsIcon, AtlassianAnalyticsLogo } from '@atlaskit/logo';

import LogoTable from '../utils/logo-table';

export default function LogoAtlassianAnalytics() {
	return (
		<LogoTable
			Logo={<AtlassianAnalyticsLogo appearance="brand" shouldUseNewLogoDesign />}
			Icon={<AtlassianAnalyticsIcon appearance="brand" shouldUseNewLogoDesign />}
		/>
	);
}
