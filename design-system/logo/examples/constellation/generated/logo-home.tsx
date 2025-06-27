import React from 'react';

import { HomeIcon, HomeLogo } from '@atlaskit/logo';

import LogoTable from '../utils/logo-table';

export default () => (
	<LogoTable Logo={<HomeLogo appearance="brand" />} Icon={<HomeIcon appearance="brand" />} />
);
