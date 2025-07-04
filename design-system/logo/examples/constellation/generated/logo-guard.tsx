import React from 'react';

import { GuardIcon, GuardLogo } from '@atlaskit/logo';

import LogoTable from '../utils/logo-table';

export default () => (
	<LogoTable
		logo={<GuardLogo appearance="brand" shouldUseNewLogoDesign />}
		icon={<GuardIcon appearance="brand" shouldUseNewLogoDesign />}
	/>
);
