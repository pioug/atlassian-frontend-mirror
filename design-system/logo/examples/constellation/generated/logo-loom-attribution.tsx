import React from 'react';

import { LoomAttributionIcon, LoomAttributionLogo } from '@atlaskit/logo';

import LogoTable from '../utils/logo-table';

export default () => (
	<LogoTable
		logo={<LoomAttributionLogo appearance="brand" shouldUseNewLogoDesign />}
		icon={<LoomAttributionIcon appearance="brand" shouldUseNewLogoDesign />}
	/>
);
