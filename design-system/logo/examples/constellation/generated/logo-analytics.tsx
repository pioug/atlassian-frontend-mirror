import React from 'react';

import { AnalyticsIcon } from '@atlaskit/logo/analytics/icon';
import { AnalyticsLogoCS as AnalyticsLogo } from '@atlaskit/logo/analytics/logo';

import LogoTable from '../utils/logo-table';

export default (): React.JSX.Element => (
	<LogoTable
		logo={<AnalyticsLogo appearance="brand" />}
		icon={<AnalyticsIcon appearance="brand" />}
	/>
);
