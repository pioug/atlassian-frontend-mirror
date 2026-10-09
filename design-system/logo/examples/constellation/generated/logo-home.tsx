import React from 'react';

import { HomeIcon } from '@atlaskit/logo/home/icon';
import { HomeLogoCS as HomeLogo } from '@atlaskit/logo/home/logo';

import LogoTable from '../utils/logo-table';

export default (): React.JSX.Element => (
	<LogoTable logo={<HomeLogo appearance="brand" />} icon={<HomeIcon appearance="brand" />} />
);
