import React from 'react';

import { AtlassianIcon } from '@atlaskit/logo/atlassian-icon';
import { AtlassianLogo } from '@atlaskit/logo/atlassian/logo';

import LogoTable from '../utils/logo-table';

export default (): React.JSX.Element => (
	<LogoTable
		logo={<AtlassianLogo appearance="brand" />}
		icon={<AtlassianIcon appearance="brand" />}
	/>
);
