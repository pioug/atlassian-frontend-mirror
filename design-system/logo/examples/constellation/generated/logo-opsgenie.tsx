import React from 'react';

import { OpsgenieIcon, OpsgenieLogo } from '@atlaskit/logo';

import LogoTable from '../utils/logo-table';

export default (): React.JSX.Element => (
	<LogoTable
		logo={<OpsgenieLogo appearance="brand" shouldUseNewLogoDesign />}
		icon={<OpsgenieIcon appearance="brand" shouldUseNewLogoDesign />}
	/>
);
