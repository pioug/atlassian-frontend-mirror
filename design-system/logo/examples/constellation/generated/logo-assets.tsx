import React from 'react';

import { AssetsIcon, AssetsLogo } from '@atlaskit/logo';

import LogoTable from '../utils/logo-table';

export default () => (
	<LogoTable Logo={<AssetsLogo appearance="brand" />} Icon={<AssetsIcon appearance="brand" />} />
);
