import React from 'react';

import { StatuspageIcon } from '@atlaskit/logo/statuspage-icon';
import { StatuspageLogoCS as StatuspageLogo } from '@atlaskit/logo/statuspage/logo';

import LogoTable from '../utils/logo-table';

export default (): React.JSX.Element => (
	<LogoTable
		logo={<StatuspageLogo appearance="brand" />}
		icon={<StatuspageIcon appearance="brand" />}
	/>
);
