import React from 'react';

import { ConfluenceDataCenterIcon } from '@atlaskit/logo/confluence-data-center/icon';
import { ConfluenceDataCenterLogoCS as ConfluenceDataCenterLogo } from '@atlaskit/logo/confluence-data-center/logo';

import LogoTable from '../utils/logo-table';

export default (): React.JSX.Element => (
	<LogoTable
		logo={<ConfluenceDataCenterLogo appearance="brand" />}
		icon={<ConfluenceDataCenterIcon appearance="brand" />}
	/>
);
