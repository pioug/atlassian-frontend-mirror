import React from 'react';

import { SearchIcon, SearchLogo } from '@atlaskit/logo';

import LogoTable from '../utils/logo-table';

export default () => (
	<LogoTable Logo={<SearchLogo appearance="brand" />} Icon={<SearchIcon appearance="brand" />} />
);
