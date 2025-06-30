import React from 'react';

import { AnalyticsIcon, AnalyticsLogo } from '@atlaskit/logo';

import LogoTable from '../utils/logo-table';

export default () => (
	<LogoTable
		logo={<AnalyticsLogo appearance="brand" />}
		icon={<AnalyticsIcon appearance="brand" />}
	/>
);
