import React from 'react';

import { ThemeProvider } from '@atlaskit/app-provider/theme-provider';
import Button from '@atlaskit/button/default/button';
import { Box } from '@atlaskit/primitives/compiled/box';
import { Inline } from '@atlaskit/primitives/compiled/inline';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import { Text } from '@atlaskit/primitives/compiled/text';

const code = `import React from 'react';
import AppProvider, { ThemeProvider } from '@atlaskit/app-provider';
import Button from '@atlaskit/button/default/button';
import { Box } from '@atlaskit/primitives/compiled/box';
import { Inline } from '@atlaskit/primitives/compiled/inline';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import { Text } from '@atlaskit/primitives/compiled/text';

function SubTreeThemingExample() {
  return (
    <AppProvider>
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
    </AppProvider>
  );
}`;

function SubTreeThemingExampleComponent(): React.JSX.Element {
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

const _default: {
	example: typeof SubTreeThemingExampleComponent;
	code: string;
} = { example: SubTreeThemingExampleComponent, code };
export default _default;
