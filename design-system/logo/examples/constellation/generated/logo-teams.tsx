import React from 'react';

import { TeamsIcon, TeamsLogo } from '@atlaskit/logo';

import LogoTable from '../utils/logo-table';

export default () => (
	<LogoTable Logo={<TeamsLogo appearance="brand" />} Icon={<TeamsIcon appearance="brand" />} />
);
