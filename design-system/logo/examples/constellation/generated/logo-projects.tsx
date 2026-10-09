import React from 'react';

import { ProjectsIcon } from '@atlaskit/logo/projects/icon';
import { ProjectsLogoCS as ProjectsLogo } from '@atlaskit/logo/projects/logo';

import LogoTable from '../utils/logo-table';

export default (): React.JSX.Element => (
	<LogoTable
		logo={<ProjectsLogo appearance="brand" />}
		icon={<ProjectsIcon appearance="brand" />}
	/>
);
