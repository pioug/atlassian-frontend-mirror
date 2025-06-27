import React from 'react';

import { StudioIcon, StudioLogo } from '@atlaskit/logo';

import LogoTable from '../utils/logo-table';

export default () => (
	<LogoTable Logo={<StudioLogo appearance="brand" />} Icon={<StudioIcon appearance="brand" />} />
);
