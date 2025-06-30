import React from 'react';

import { CrowdIcon, CrowdLogo } from '@atlaskit/logo';

import LogoTable from '../utils/logo-table';

export default () => (
	<LogoTable logo={<CrowdLogo appearance="brand" />} icon={<CrowdIcon appearance="brand" />} />
);
