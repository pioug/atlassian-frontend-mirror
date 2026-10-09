import React from 'react';

import { BambooIcon } from '@atlaskit/logo/bamboo/icon';
import { BambooLogoCS as BambooLogo } from '@atlaskit/logo/bamboo/logo';

import LogoTable from '../utils/logo-table';

export default (): React.JSX.Element => (
	<LogoTable logo={<BambooLogo appearance="brand" />} icon={<BambooIcon appearance="brand" />} />
);
