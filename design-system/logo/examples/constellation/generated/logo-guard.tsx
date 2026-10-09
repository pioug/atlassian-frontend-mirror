import React from 'react';

import { GuardIcon } from '@atlaskit/logo/guard/icon';
import { GuardLogoCS as GuardLogo } from '@atlaskit/logo/guard/logo';

import LogoTable from '../utils/logo-table';

export default (): React.JSX.Element => (
	<LogoTable logo={<GuardLogo appearance="brand" />} icon={<GuardIcon appearance="brand" />} />
);
