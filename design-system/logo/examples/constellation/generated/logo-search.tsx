import React from 'react';

import { SearchIcon } from '@atlaskit/logo/search/icon';
import { SearchLogoCS as SearchLogo } from '@atlaskit/logo/search/logo';

import LogoTable from '../utils/logo-table';

export default (): React.JSX.Element => (
	<LogoTable logo={<SearchLogo appearance="brand" />} icon={<SearchIcon appearance="brand" />} />
);
