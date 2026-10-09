import React from 'react';

import { HubIcon } from '@atlaskit/logo/hub/icon';
import { HubLogoCS as HubLogo } from '@atlaskit/logo/hub/logo';

import LogoTable from '../utils/logo-table';

export default (): React.JSX.Element => (
	<LogoTable logo={<HubLogo appearance="brand" />} icon={<HubIcon appearance="brand" />} />
);
