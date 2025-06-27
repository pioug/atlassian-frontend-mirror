import React from 'react';

import { BitbucketIcon, BitbucketLogo } from '@atlaskit/logo';

import LogoTable from '../utils/logo-table';

export default () => (
	<LogoTable
		Logo={<BitbucketLogo appearance="brand" shouldUseNewLogoDesign />}
		Icon={<BitbucketIcon appearance="brand" shouldUseNewLogoDesign />}
	/>
);
