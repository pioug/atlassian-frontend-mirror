import React from 'react';

import { JiraProductDiscoveryIcon } from '@atlaskit/logo/jira-product-discovery/icon';
import { JiraProductDiscoveryLogoCS as JiraProductDiscoveryLogo } from '@atlaskit/logo/jira-product-discovery/logo';

import LogoTable from '../utils/logo-table';

export default (): React.JSX.Element => (
	<LogoTable
		logo={<JiraProductDiscoveryLogo appearance="brand" />}
		icon={<JiraProductDiscoveryIcon appearance="brand" />}
	/>
);
