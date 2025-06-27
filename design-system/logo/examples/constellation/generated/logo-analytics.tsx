import React from 'react';

import { AnalyticsIcon, AnalyticsLogo } from '@atlaskit/logo';

import LogoTable from '../utils/logo-table';

export default () => (
	<LogoTable
		Logo={<AnalyticsLogo appearance="brand" />}
		Icon={<AnalyticsIcon appearance="brand" />}
	/>
);
