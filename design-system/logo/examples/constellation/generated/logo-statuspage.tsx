import React from 'react';

import { StatuspageIcon, StatuspageLogo } from '@atlaskit/logo';

import LogoTable from '../utils/logo-table';

export default () => (
	<LogoTable
		Logo={<StatuspageLogo appearance="brand" shouldUseNewLogoDesign />}
		Icon={<StatuspageIcon appearance="brand" shouldUseNewLogoDesign />}
	/>
);
