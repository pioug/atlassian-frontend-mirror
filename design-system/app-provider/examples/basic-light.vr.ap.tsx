import React from 'react';

import AppProvider from '@atlaskit/app-provider/app-provider';
import { useColorMode } from '@atlaskit/app-provider/use-color-mode';
import { Box } from '@atlaskit/primitives/compiled';

function Basic() {
	const colorMode = useColorMode();

	return <Box padding="space.200">Color mode: {colorMode}</Box>;
}

export default function BasicLight(): React.JSX.Element {
	return (
		<AppProvider defaultColorMode="light">
			<Basic />
		</AppProvider>
	);
}
