import React from 'react';

import { BitbucketIcon, BitbucketLogo } from '@atlaskit/logo';

import LogoTable from '../utils/logo-table';

export default () => (
	<LogoTable
		logo={<BitbucketLogo appearance="brand" shouldUseNewLogoDesign />}
		icon={<BitbucketIcon appearance="brand" shouldUseNewLogoDesign />}
	/>
);
