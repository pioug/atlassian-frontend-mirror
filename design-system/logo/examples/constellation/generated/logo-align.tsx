import React from 'react';

import { AlignIcon, AlignLogo } from '@atlaskit/logo';

import LogoTable from '../utils/logo-table';

export default () => (
	<LogoTable Logo={<AlignLogo appearance="brand" />} Icon={<AlignIcon appearance="brand" />} />
);
