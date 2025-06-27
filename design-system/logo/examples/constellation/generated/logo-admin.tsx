import React from 'react';

import { AdminIcon, AdminLogo } from '@atlaskit/logo';

import LogoTable from '../utils/logo-table';

export default () => (
	<LogoTable Logo={<AdminLogo appearance="brand" />} Icon={<AdminIcon appearance="brand" />} />
);
