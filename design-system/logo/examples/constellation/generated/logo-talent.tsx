import React from 'react';

import { TalentIcon, TalentLogo } from '@atlaskit/logo';

import LogoTable from '../utils/logo-table';

export default () => (
	<LogoTable Logo={<TalentLogo appearance="brand" />} Icon={<TalentIcon appearance="brand" />} />
);
