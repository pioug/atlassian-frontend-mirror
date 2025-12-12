import React from 'react';

import { CompassIcon, CompassLogo } from '@atlaskit/logo';

import LogoTable from '../utils/logo-table';

export default (): React.JSX.Element => (
	<LogoTable
		logo={<CompassLogo appearance="brand" shouldUseNewLogoDesign />}
		icon={<CompassIcon appearance="brand" shouldUseNewLogoDesign />}
	/>
);
