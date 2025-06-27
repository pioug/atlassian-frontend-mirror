import React from 'react';

import { CompassIcon, CompassLogo } from '@atlaskit/logo';

import LogoTable from '../utils/logo-table';

export default () => (
	<LogoTable
		Logo={<CompassLogo appearance="brand" shouldUseNewLogoDesign />}
		Icon={<CompassIcon appearance="brand" shouldUseNewLogoDesign />}
	/>
);
