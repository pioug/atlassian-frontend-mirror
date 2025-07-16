import React from 'react';

import AppProvider, { useColorMode } from '@atlaskit/app-provider';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box } from '@atlaskit/primitives';

function Basic() {
	const colorMode = useColorMode();

	return <Box padding="space.200">Color mode: {colorMode}</Box>;
}

export default function () {
	return (
		<AppProvider defaultColorMode="dark">
			<Basic />
		</AppProvider>
	);
}
