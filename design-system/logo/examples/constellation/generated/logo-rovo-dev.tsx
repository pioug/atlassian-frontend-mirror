import React from 'react';

import { RovoDevIcon, RovoDevLogo } from '@atlaskit/logo';

import LogoTable from '../utils/logo-table';

export default (): React.JSX.Element => (
	<LogoTable logo={<RovoDevLogo appearance="brand" />} icon={<RovoDevIcon appearance="brand" />} />
);
