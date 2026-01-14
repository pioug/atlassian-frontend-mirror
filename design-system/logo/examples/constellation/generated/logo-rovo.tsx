import React from 'react';

import { RovoIcon, RovoLogo } from '@atlaskit/logo';

import LogoTable from '../utils/logo-table';

export default (): React.JSX.Element => (
	<LogoTable logo={<RovoLogo appearance="brand" />} icon={<RovoIcon appearance="brand" />} />
);
