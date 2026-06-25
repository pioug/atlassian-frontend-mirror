/**
 * When used outside of AppProvider, ThemeProvider scopes its theme to its
 * own subtree only. It does not set page-level theme attributes, so the
 * page background and other global styles will not be themed.
 *
 * For full page theming, use AppProvider at the root of your application.
 */
import React from 'react';

import { ThemeProvider } from '@atlaskit/app-provider';
import Button from '@atlaskit/button/new';
import { Box, Inline, Stack, Text } from '@atlaskit/primitives/compiled';

function SubTreeThemingOutsideAppProviderExample(): React.JSX.Element {
	return (
		<ThemeProvider defaultColorMode="light">
			<Box backgroundColor="elevation.surface" padding="space.300">
				<Stack space="space.200">
					<Text as="p">This sub-tree theme is light mode.</Text>
					<Inline space="space.100">
						<Button>Button</Button>
					</Inline>

					<ThemeProvider defaultColorMode="dark">
						<Box backgroundColor="elevation.surface" padding="space.300">
							<Stack space="space.200">
								<Text as="p">This nested sub-tree theme is dark mode.</Text>
								<Inline space="space.100">
									<Button>Button</Button>
								</Inline>
							</Stack>
						</Box>
					</ThemeProvider>
				</Stack>
			</Box>
		</ThemeProvider>
	);
}

export default SubTreeThemingOutsideAppProviderExample;
