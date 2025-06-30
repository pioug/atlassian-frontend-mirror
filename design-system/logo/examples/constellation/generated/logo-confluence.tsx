import React from 'react';

import { ConfluenceIcon, ConfluenceLogo } from '@atlaskit/logo';

import LogoTable from '../utils/logo-table';

export default () => (
	<LogoTable
		logo={<ConfluenceLogo appearance="brand" shouldUseNewLogoDesign />}
		icon={<ConfluenceIcon appearance="brand" shouldUseNewLogoDesign />}
	/>
);
