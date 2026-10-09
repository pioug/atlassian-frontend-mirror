import React from 'react';

import { AdminIcon } from '@atlaskit/logo/admin/icon';
import { AdminLogoCS as AdminLogo } from '@atlaskit/logo/admin/logo';

import LogoTable from '../utils/logo-table';

export default (): React.JSX.Element => (
	<LogoTable logo={<AdminLogo appearance="brand" />} icon={<AdminIcon appearance="brand" />} />
);
