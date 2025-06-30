import React from 'react';

import { HubIcon, HubLogo } from '@atlaskit/logo';

import LogoTable from '../utils/logo-table';

export default () => (
	<LogoTable logo={<HubLogo appearance="brand" />} icon={<HubIcon appearance="brand" />} />
);
