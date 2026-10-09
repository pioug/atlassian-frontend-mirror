import React from 'react';

import { TeamsIcon } from '@atlaskit/logo/teams/icon';
import { TeamsLogoCS as TeamsLogo } from '@atlaskit/logo/teams/logo';

import LogoTable from '../utils/logo-table';

export default (): React.JSX.Element => (
	<LogoTable logo={<TeamsLogo appearance="brand" />} icon={<TeamsIcon appearance="brand" />} />
);
