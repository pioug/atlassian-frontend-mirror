import React from 'react';

import { JiraIcon, JiraLogo } from '@atlaskit/logo';

import LogoTable from '../utils/logo-table';

export default (): React.JSX.Element => (
	<LogoTable logo={<JiraLogo appearance="brand" />} icon={<JiraIcon appearance="brand" />} />
);
