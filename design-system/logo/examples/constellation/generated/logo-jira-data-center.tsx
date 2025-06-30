import React from 'react';

import { JiraDataCenterIcon, JiraDataCenterLogo } from '@atlaskit/logo';

import LogoTable from '../utils/logo-table';

export default () => (
	<LogoTable
		logo={<JiraDataCenterLogo appearance="brand" />}
		icon={<JiraDataCenterIcon appearance="brand" />}
	/>
);
