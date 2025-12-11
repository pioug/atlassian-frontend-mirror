import React from 'react';

import { StudioIcon, StudioLogo } from '@atlaskit/logo';

import LogoTable from '../utils/logo-table';

export default (): React.JSX.Element => (
	<LogoTable logo={<StudioLogo appearance="brand" />} icon={<StudioIcon appearance="brand" />} />
);
