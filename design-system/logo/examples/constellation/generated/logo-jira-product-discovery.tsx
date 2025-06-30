import React from 'react';

import { JiraProductDiscoveryIcon, JiraProductDiscoveryLogo } from '@atlaskit/logo';

import LogoTable from '../utils/logo-table';

export default () => (
	<LogoTable
		logo={<JiraProductDiscoveryLogo appearance="brand" shouldUseNewLogoDesign />}
		icon={<JiraProductDiscoveryIcon appearance="brand" shouldUseNewLogoDesign />}
	/>
);
