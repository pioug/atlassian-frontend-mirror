import React from 'react';

import { TrelloIcon, TrelloLogo } from '@atlaskit/logo';

import LogoTable from '../utils/logo-table';

export default () => (
	<LogoTable
		logo={<TrelloLogo appearance="brand" shouldUseNewLogoDesign />}
		icon={<TrelloIcon appearance="brand" shouldUseNewLogoDesign />}
	/>
);
