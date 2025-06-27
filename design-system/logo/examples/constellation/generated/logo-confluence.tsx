import React from 'react';

import { ConfluenceIcon, ConfluenceLogo } from '@atlaskit/logo';

import LogoTable from '../utils/logo-table';

export default () => (
	<LogoTable
		Logo={<ConfluenceLogo appearance="brand" shouldUseNewLogoDesign />}
		Icon={<ConfluenceIcon appearance="brand" shouldUseNewLogoDesign />}
	/>
);
