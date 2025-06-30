import React from 'react';

import { SearchIcon, SearchLogo } from '@atlaskit/logo';

import LogoTable from '../utils/logo-table';

export default () => (
	<LogoTable logo={<SearchLogo appearance="brand" />} icon={<SearchIcon appearance="brand" />} />
);
