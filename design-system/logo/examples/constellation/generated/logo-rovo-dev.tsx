import React from 'react';

import { RovoDevIcon } from '@atlaskit/logo/rovo-dev/icon';
import { RovoDevLogoCS as RovoDevLogo } from '@atlaskit/logo/rovo-dev/logo';

import LogoTable from '../utils/logo-table';

export default (): React.JSX.Element => (
	<LogoTable logo={<RovoDevLogo appearance="brand" />} icon={<RovoDevIcon appearance="brand" />} />
);
