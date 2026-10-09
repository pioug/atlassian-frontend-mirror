import React from 'react';

import { JiraIcon } from '@atlaskit/logo/jira-icon';
import { JiraLogoCS as JiraLogo } from '@atlaskit/logo/jira/logo';

import LogoTable from '../utils/logo-table';

export default (): React.JSX.Element => (
	<LogoTable logo={<JiraLogo appearance="brand" />} icon={<JiraIcon appearance="brand" />} />
);
