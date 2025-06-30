import React from 'react';

import { TalentIcon, TalentLogo } from '@atlaskit/logo';

import LogoTable from '../utils/logo-table';

export default () => (
	<LogoTable logo={<TalentLogo appearance="brand" />} icon={<TalentIcon appearance="brand" />} />
);
