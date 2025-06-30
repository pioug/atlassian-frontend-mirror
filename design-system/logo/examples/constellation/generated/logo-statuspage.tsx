import React from 'react';

import { StatuspageIcon, StatuspageLogo } from '@atlaskit/logo';

import LogoTable from '../utils/logo-table';

export default () => (
	<LogoTable
		logo={<StatuspageLogo appearance="brand" shouldUseNewLogoDesign />}
		icon={<StatuspageIcon appearance="brand" shouldUseNewLogoDesign />}
	/>
);
