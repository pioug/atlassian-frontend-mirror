import React from 'react';

import { AlignIcon, AlignLogo } from '@atlaskit/logo';

import LogoTable from '../utils/logo-table';

export default (): React.JSX.Element => (
	<LogoTable logo={<AlignLogo appearance="brand" />} icon={<AlignIcon appearance="brand" />} />
);
