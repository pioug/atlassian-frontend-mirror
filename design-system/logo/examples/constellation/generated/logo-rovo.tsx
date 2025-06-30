import React from 'react';

import { RovoIcon, RovoLogo } from '@atlaskit/logo';

import LogoTable from '../utils/logo-table';

export default () => (
	<LogoTable
		logo={<RovoLogo appearance="brand" shouldUseNewLogoDesign />}
		icon={<RovoIcon appearance="brand" shouldUseNewLogoDesign />}
	/>
);
