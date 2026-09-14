import React from 'react';

import { AtlassianAccessIcon } from '@atlaskit/logo/atlassian-access/icon';
import { AtlassianAccessLogo } from '@atlaskit/logo/atlassian-access/logo';

import LogoTable from '../utils/logo-table';

export default (): React.JSX.Element => (
	<LogoTable
		logo={<AtlassianAccessLogo appearance="brand" />}
		icon={<AtlassianAccessIcon appearance="brand" />}
	/>
);
