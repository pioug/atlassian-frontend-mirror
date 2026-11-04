/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { AppProvider } from '@atlaskit/app-provider/app-provider';
import { ThemeProvider } from '@atlaskit/app-provider/theme-provider';
import { useColorMode } from '@atlaskit/app-provider/use-color-mode';
import { cssMap, jsx } from '@atlaskit/css';
import Heading from '@atlaskit/heading/heading';
import { Box } from '@atlaskit/primitives/compiled/box';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import { Text } from '@atlaskit/primitives/compiled/text';

import FinesseSpecimens from './shared/finesse-specimens';

const styles = cssMap({
	root: { width: '640px' },
});

function OppositeColorMode(): React.JSX.Element {
	const parentMode = useColorMode();
	const childMode = parentMode === 'light' ? 'dark' : 'light';

	return (
		<Stack space="space.200">
			<Heading as="h1" size="large">
				Nested Finesse themes
			</Heading>
			<Text as="p">
				{parentMode === 'light' ? 'Light' : 'Dark'} app with a {childMode} subtree
			</Text>
			<ThemeProvider defaultColorMode={childMode}>
				<Box backgroundColor="elevation.surface" padding="space.250">
					<FinesseSpecimens />
				</Box>
			</ThemeProvider>
		</Stack>
	);
}

export default function NestedFinesseExample(): React.JSX.Element {
	return (
		<AppProvider defaultColorMode="auto">
			<Box backgroundColor="elevation.surface" padding="space.250" xcss={styles.root}>
				<OppositeColorMode />
			</Box>
		</AppProvider>
	);
}
