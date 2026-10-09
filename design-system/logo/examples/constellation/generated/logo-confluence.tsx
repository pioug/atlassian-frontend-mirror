import React from 'react';

import { ConfluenceIcon } from '@atlaskit/logo/confluence-icon';
import { ConfluenceLogoCS as ConfluenceLogo } from '@atlaskit/logo/confluence/logo';

import LogoTable from '../utils/logo-table';

export default (): React.JSX.Element => (
	<LogoTable
		logo={<ConfluenceLogo appearance="brand" />}
		icon={<ConfluenceIcon appearance="brand" />}
	/>
);
