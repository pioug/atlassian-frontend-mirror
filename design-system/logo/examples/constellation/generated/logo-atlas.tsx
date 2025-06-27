import React from 'react';

import { AtlasIcon, AtlasLogo } from '@atlaskit/logo';

import LogoTable from '../utils/logo-table';

export default function LogoAtlas() {
	return (
		<LogoTable Logo={<AtlasLogo appearance="brand" />} Icon={<AtlasIcon appearance="brand" />} />
	);
}
