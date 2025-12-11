import React from 'react';

import { SearchIcon, SearchLogo } from '@atlaskit/logo';

import LogoTable from '../utils/logo-table';

export default (): React.JSX.Element => (
	<LogoTable logo={<SearchLogo appearance="brand" />} icon={<SearchIcon appearance="brand" />} />
);
