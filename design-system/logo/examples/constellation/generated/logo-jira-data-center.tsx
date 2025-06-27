import React from 'react';

import { JiraDataCenterIcon, JiraDataCenterLogo } from '@atlaskit/logo';

import LogoTable from '../utils/logo-table';

export default () => (
	<LogoTable
		Logo={<JiraDataCenterLogo appearance="brand" />}
		Icon={<JiraDataCenterIcon appearance="brand" />}
	/>
);
