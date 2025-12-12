import React from 'react';

import { CrowdIcon, CrowdLogo } from '@atlaskit/logo';

import LogoTable from '../utils/logo-table';

export default (): React.JSX.Element => (
	<LogoTable logo={<CrowdLogo appearance="brand" />} icon={<CrowdIcon appearance="brand" />} />
);
