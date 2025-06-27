import React from 'react';

import { TrelloIcon, TrelloLogo } from '@atlaskit/logo';

import LogoTable from '../utils/logo-table';

export default () => (
	<LogoTable
		Logo={<TrelloLogo appearance="brand" shouldUseNewLogoDesign />}
		Icon={<TrelloIcon appearance="brand" shouldUseNewLogoDesign />}
	/>
);
