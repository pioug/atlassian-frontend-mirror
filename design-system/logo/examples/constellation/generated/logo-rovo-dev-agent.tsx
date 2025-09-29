import React from 'react';

import { RovoDevAgentIcon, RovoDevAgentLogo } from '@atlaskit/logo';

import LogoTable from '../utils/logo-table';

export default () => (
	<LogoTable
		logo={<RovoDevAgentLogo appearance="brand" />}
		icon={<RovoDevAgentIcon appearance="brand" />}
	/>
);
