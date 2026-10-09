import React from 'react';

import { LoomAttributionLogoCS as LoomAttributionLogo } from '@atlaskit/logo/loom-attribution/logo';
import { LoomIcon as LoomAttributionIcon } from '@atlaskit/logo/loom/icon';

import LogoTable from '../utils/logo-table';

export default (): React.JSX.Element => (
	<LogoTable
		logo={<LoomAttributionLogo appearance="brand" />}
		icon={<LoomAttributionIcon appearance="brand" />}
	/>
);
