import React from 'react';

import { RovoDevAgentIcon } from '@atlaskit/logo/rovo-dev-agent/icon';
import { RovoDevAgentLogoCS as RovoDevAgentLogo } from '@atlaskit/logo/rovo-dev-agent/logo';

import LogoTable from '../utils/logo-table';

export default (): React.JSX.Element => (
	<LogoTable
		logo={<RovoDevAgentLogo appearance="brand" />}
		icon={<RovoDevAgentIcon appearance="brand" />}
	/>
);
