import React from 'react';

import { OpsgenieIcon } from '@atlaskit/logo/opsgenie-icon';
import { OpsgenieLogoCS as OpsgenieLogo } from '@atlaskit/logo/opsgenie/logo';

import LogoTable from '../utils/logo-table';

export default (): React.JSX.Element => (
	<LogoTable
		logo={<OpsgenieLogo appearance="brand" />}
		icon={<OpsgenieIcon appearance="brand" />}
	/>
);
