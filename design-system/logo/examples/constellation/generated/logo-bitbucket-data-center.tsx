import React from 'react';

import { BitbucketDataCenterIcon } from '@atlaskit/logo/bitbucket-data-center/icon';
import { BitbucketDataCenterLogoCS as BitbucketDataCenterLogo } from '@atlaskit/logo/bitbucket-data-center/logo';

import LogoTable from '../utils/logo-table';

export default (): React.JSX.Element => (
	<LogoTable
		logo={<BitbucketDataCenterLogo appearance="brand" />}
		icon={<BitbucketDataCenterIcon appearance="brand" />}
	/>
);
