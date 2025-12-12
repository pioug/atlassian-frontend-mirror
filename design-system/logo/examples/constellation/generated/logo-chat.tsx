import React from 'react';

import { ChatIcon, ChatLogo } from '@atlaskit/logo';

import LogoTable from '../utils/logo-table';

export default (): React.JSX.Element => (
	<LogoTable logo={<ChatLogo appearance="brand" />} icon={<ChatIcon appearance="brand" />} />
);
