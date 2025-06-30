import React from 'react';

import { TeamsIcon, TeamsLogo } from '@atlaskit/logo';

import LogoTable from '../utils/logo-table';

export default () => (
	<LogoTable logo={<TeamsLogo appearance="brand" />} icon={<TeamsIcon appearance="brand" />} />
);
