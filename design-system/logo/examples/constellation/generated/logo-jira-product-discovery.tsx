import React from 'react';

import { JiraProductDiscoveryIcon, JiraProductDiscoveryLogo } from '@atlaskit/logo';

import LogoTable from '../utils/logo-table';

export default () => (
	<LogoTable
		Logo={<JiraProductDiscoveryLogo appearance="brand" shouldUseNewLogoDesign />}
		Icon={<JiraProductDiscoveryIcon appearance="brand" shouldUseNewLogoDesign />}
	/>
);
