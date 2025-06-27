import React from 'react';

import { LoomIcon, LoomLogo } from '@atlaskit/logo';

import LogoTable from '../utils/logo-table';

export default () => (
	<LogoTable
		Logo={<LoomLogo appearance="brand" shouldUseNewLogoDesign />}
		Icon={<LoomIcon appearance="brand" shouldUseNewLogoDesign />}
	/>
);
