import React from 'react';

import { FocusIcon, FocusLogo } from '@atlaskit/logo';

import LogoTable from '../utils/logo-table';

export default () => (
	<LogoTable
		Logo={<FocusLogo appearance="brand" shouldUseNewLogoDesign />}
		Icon={<FocusIcon appearance="brand" shouldUseNewLogoDesign />}
	/>
);
