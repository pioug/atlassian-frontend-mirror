import React from 'react';

import { HomeIcon, HomeLogo } from '@atlaskit/logo';

import LogoTable from '../utils/logo-table';

export default (): React.JSX.Element => (
	<LogoTable logo={<HomeLogo appearance="brand" />} icon={<HomeIcon appearance="brand" />} />
);
