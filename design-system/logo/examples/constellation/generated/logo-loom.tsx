import React from 'react';

import { LoomBlurpleIcon, LoomBlurpleLogo, LoomIcon, LoomLogo } from '@atlaskit/logo';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Stack } from '@atlaskit/primitives';

import LogoTable from '../utils/logo-table';

export default () => (
	<Stack space="space.100">
		<LogoTable
			logo={[
				<LoomLogo appearance="brand" shouldUseNewLogoDesign />,
				<LoomBlurpleLogo appearance="brand" />,
			]}
			icon={[
				<LoomIcon appearance="brand" shouldUseNewLogoDesign />,
				<LoomBlurpleIcon appearance="brand" />,
			]}
		/>
	</Stack>
);
