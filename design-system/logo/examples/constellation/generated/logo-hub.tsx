import React from 'react';

import { HubIcon, HubLogo } from '@atlaskit/logo';

import LogoTable from '../utils/logo-table';

export default () => (
	<LogoTable Logo={<HubLogo appearance="brand" />} Icon={<HubIcon appearance="brand" />} />
);
