import React from 'react';

import { BitbucketDataCenterIcon, BitbucketDataCenterLogo } from '@atlaskit/logo';

import LogoTable from '../utils/logo-table';

export default () => (
	<LogoTable
		Logo={<BitbucketDataCenterLogo appearance="brand" />}
		Icon={<BitbucketDataCenterIcon appearance="brand" />}
	/>
);
