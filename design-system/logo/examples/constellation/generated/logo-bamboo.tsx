import React from 'react';

import { BambooIcon, BambooLogo } from '@atlaskit/logo';

import LogoTable from '../utils/logo-table';

export default (): React.JSX.Element => (
	<LogoTable logo={<BambooLogo appearance="brand" />} icon={<BambooIcon appearance="brand" />} />
);
