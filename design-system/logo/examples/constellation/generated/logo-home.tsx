import React from 'react';

import { HomeIcon, HomeLogo } from '@atlaskit/logo';

import LogoTable from '../utils/logo-table';

export default () => (
	<LogoTable logo={<HomeLogo appearance="brand" />} icon={<HomeIcon appearance="brand" />} />
);
