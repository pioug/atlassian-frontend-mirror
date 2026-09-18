import React from 'react';

import { InsightsIcon } from '@atlaskit/logo/insights/icon';
import { InsightsLogo } from '@atlaskit/logo/insights/logo';

import LogoTable from '../utils/logo-table';

export default (): React.JSX.Element => (
	<LogoTable
		logo={<InsightsLogo appearance="brand" />}
		icon={<InsightsIcon appearance="brand" />}
	/>
);
