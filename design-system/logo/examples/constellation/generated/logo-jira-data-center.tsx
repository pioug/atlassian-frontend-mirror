import React from 'react';

import { JiraDataCenterIcon } from '@atlaskit/logo/jira-data-center/icon';
import { JiraDataCenterLogoCS as JiraDataCenterLogo } from '@atlaskit/logo/jira-data-center/logo';

import LogoTable from '../utils/logo-table';

export default (): React.JSX.Element => (
	<LogoTable
		logo={<JiraDataCenterLogo appearance="brand" />}
		icon={<JiraDataCenterIcon appearance="brand" />}
	/>
);
