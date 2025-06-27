import React from 'react';

import { OpsgenieIcon, OpsgenieLogo } from '@atlaskit/logo';

import LogoTable from '../utils/logo-table';

export default () => (
	<LogoTable
		Logo={<OpsgenieLogo appearance="brand" shouldUseNewLogoDesign />}
		Icon={<OpsgenieIcon appearance="brand" shouldUseNewLogoDesign />}
	/>
);
