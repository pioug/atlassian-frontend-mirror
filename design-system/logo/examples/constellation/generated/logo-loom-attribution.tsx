import React from 'react';

import { LoomAttributionIcon, LoomAttributionLogo } from '@atlaskit/logo';

import LogoTable from '../utils/logo-table';

export default () => (
	<LogoTable
		Logo={<LoomAttributionLogo appearance="brand" shouldUseNewLogoDesign />}
		Icon={<LoomAttributionIcon appearance="brand" shouldUseNewLogoDesign />}
	/>
);
