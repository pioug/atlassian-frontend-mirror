import React from 'react';

import { ChatIcon, ChatLogo } from '@atlaskit/logo';

import LogoTable from '../utils/logo-table';

export default () => (
	<LogoTable Logo={<ChatLogo appearance="brand" />} Icon={<ChatIcon appearance="brand" />} />
);
