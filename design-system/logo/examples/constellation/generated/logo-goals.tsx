import React from 'react';

import { GoalsIcon, GoalsLogo } from '@atlaskit/logo';

import LogoTable from '../utils/logo-table';

export default () => (
	<LogoTable logo={<GoalsLogo appearance="brand" />} icon={<GoalsIcon appearance="brand" />} />
);
