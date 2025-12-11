import React from 'react';

import { ProjectsIcon, ProjectsLogo } from '@atlaskit/logo';

import LogoTable from '../utils/logo-table';

export default (): React.JSX.Element => (
	<LogoTable
		logo={<ProjectsLogo appearance="brand" />}
		icon={<ProjectsIcon appearance="brand" />}
	/>
);
