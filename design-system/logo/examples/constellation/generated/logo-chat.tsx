import React from 'react';

import { ChatIcon } from '@atlaskit/logo/chat/icon';
import { ChatLogoCS as ChatLogo } from '@atlaskit/logo/chat/logo';

import LogoTable from '../utils/logo-table';

export default (): React.JSX.Element => (
	<LogoTable logo={<ChatLogo appearance="brand" />} icon={<ChatIcon appearance="brand" />} />
);
