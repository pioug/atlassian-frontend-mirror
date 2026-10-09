import React from 'react';

import { BitbucketIcon } from '@atlaskit/logo/bitbucket-icon';
import { BitbucketLogoCS as BitbucketLogo } from '@atlaskit/logo/bitbucket/logo';

import LogoTable from '../utils/logo-table';

export default (): React.JSX.Element => (
	<LogoTable
		logo={<BitbucketLogo appearance="brand" />}
		icon={<BitbucketIcon appearance="brand" />}
	/>
);
