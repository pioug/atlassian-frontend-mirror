import React from 'react';

import { AdminIcon, AdminLogo } from '@atlaskit/logo';

import LogoTable from '../utils/logo-table';

export default () => (
	<LogoTable logo={<AdminLogo appearance="brand" />} icon={<AdminIcon appearance="brand" />} />
);
