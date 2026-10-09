import React from 'react';

import { AssetsIcon } from '@atlaskit/logo/assets/icon';
import { AssetsLogoCS as AssetsLogo } from '@atlaskit/logo/assets/logo';

import LogoTable from '../utils/logo-table';

export default (): React.JSX.Element => (
	<LogoTable logo={<AssetsLogo appearance="brand" />} icon={<AssetsIcon appearance="brand" />} />
);
