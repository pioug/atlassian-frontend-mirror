import React from 'react';

import { JiraIcon, JiraLogo } from '@atlaskit/logo';

import LogoTable from '../utils/logo-table';

export default () => (
	<LogoTable
		Logo={<JiraLogo appearance="brand" shouldUseNewLogoDesign />}
		Icon={<JiraIcon appearance="brand" shouldUseNewLogoDesign />}
	/>
);
