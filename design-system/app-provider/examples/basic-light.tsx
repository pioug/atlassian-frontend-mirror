import React from 'react';

import AppProvider, { useColorMode } from '@atlaskit/app-provider';
import { Box } from '@atlaskit/primitives/compiled';

function Basic() {
	const colorMode = useColorMode();

	return <Box padding="space.200">Color mode: {colorMode}</Box>;
}


export default function (): React.JSX.Element {
	return (
		<AppProvider defaultColorMode="light">
			<Basic />
		</AppProvider>
	);
}
