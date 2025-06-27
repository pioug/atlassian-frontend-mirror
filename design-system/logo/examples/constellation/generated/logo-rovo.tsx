import React from 'react';

import { RovoIcon, RovoLogo } from '@atlaskit/logo';

import LogoTable from '../utils/logo-table';

export default () => (
	<LogoTable
		Logo={<RovoLogo appearance="brand" shouldUseNewLogoDesign />}
		Icon={<RovoIcon appearance="brand" shouldUseNewLogoDesign />}
	/>
);
