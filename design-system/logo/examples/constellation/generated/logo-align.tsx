import React from 'react';

import { AlignIcon } from '@atlaskit/logo/align/icon';
import { AlignLogoCS as AlignLogo } from '@atlaskit/logo/align/logo';

import LogoTable from '../utils/logo-table';

export default (): React.JSX.Element => (
	<LogoTable logo={<AlignLogo appearance="brand" />} icon={<AlignIcon appearance="brand" />} />
);
