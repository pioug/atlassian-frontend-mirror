import React from 'react';

import { AssetsIcon, AssetsLogo } from '@atlaskit/logo';

import LogoTable from '../utils/logo-table';

export default (): React.JSX.Element => (
	<LogoTable logo={<AssetsLogo appearance="brand" />} icon={<AssetsIcon appearance="brand" />} />
);
