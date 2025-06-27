import React from 'react';

import { JiraSoftwareIcon, JiraSoftwareLogo } from '@atlaskit/logo';

import LogoTable from '../utils/logo-table';

export default function LogoJiraSoftware() {
	return (
		<LogoTable
			Logo={<JiraSoftwareLogo appearance="brand" />}
			Icon={<JiraSoftwareIcon appearance="brand" />}
		/>
	);
}
