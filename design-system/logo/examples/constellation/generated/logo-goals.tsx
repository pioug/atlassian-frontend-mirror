import React from 'react';

import { GoalsIcon, GoalsLogo } from '@atlaskit/logo';

import LogoTable from '../utils/logo-table';

export default () => (
	<LogoTable Logo={<GoalsLogo appearance="brand" />} Icon={<GoalsIcon appearance="brand" />} />
);
