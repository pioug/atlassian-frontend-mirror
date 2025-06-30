import React from 'react';

import { FocusIcon, FocusLogo } from '@atlaskit/logo';

import LogoTable from '../utils/logo-table';

export default () => (
	<LogoTable
		logo={<FocusLogo appearance="brand" shouldUseNewLogoDesign />}
		icon={<FocusIcon appearance="brand" shouldUseNewLogoDesign />}
	/>
);
