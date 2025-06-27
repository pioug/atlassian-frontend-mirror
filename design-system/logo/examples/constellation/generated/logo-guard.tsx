import React from 'react';

import { GuardIcon, GuardLogo } from '@atlaskit/logo';

import LogoTable from '../utils/logo-table';

export default () => (
	<LogoTable
		Logo={<GuardLogo appearance="brand" shouldUseNewLogoDesign />}
		Icon={<GuardIcon appearance="brand" shouldUseNewLogoDesign />}
	/>
);
