import React from 'react';

import { RovoIcon } from '@atlaskit/logo/rovo/icon';
import { RovoLogoCS as RovoLogo } from '@atlaskit/logo/rovo/logo';

import LogoTable from '../utils/logo-table';

export default (): React.JSX.Element => (
	<LogoTable logo={<RovoLogo appearance="brand" />} icon={<RovoIcon appearance="brand" />} />
);
