import React from 'react';

import { LoomBlurpleIcon, LoomBlurpleLogo, LoomIcon, LoomLogo } from '@atlaskit/logo';
import { Stack } from '@atlaskit/primitives/compiled';

import LogoTable from '../utils/logo-table';

export default (): React.JSX.Element => (
	<Stack space="space.100">
		<LogoTable
			logo={[<LoomLogo appearance="brand" />, <LoomBlurpleLogo appearance="brand" />]}
			icon={[<LoomIcon appearance="brand" />, <LoomBlurpleIcon appearance="brand" />]}
		/>
	</Stack>
);
