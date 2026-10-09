import React from 'react';

import { GoalsIcon } from '@atlaskit/logo/goals/icon';
import { GoalsLogoCS as GoalsLogo } from '@atlaskit/logo/goals/logo';

import LogoTable from '../utils/logo-table';

export default (): React.JSX.Element => (
	<LogoTable logo={<GoalsLogo appearance="brand" />} icon={<GoalsIcon appearance="brand" />} />
);
