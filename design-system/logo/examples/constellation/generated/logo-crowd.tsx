import React from 'react';

import { CrowdIcon } from '@atlaskit/logo/crowd/icon';
import { CrowdLogoCS as CrowdLogo } from '@atlaskit/logo/crowd/logo';

import LogoTable from '../utils/logo-table';

export default (): React.JSX.Element => (
	<LogoTable logo={<CrowdLogo appearance="brand" />} icon={<CrowdIcon appearance="brand" />} />
);
