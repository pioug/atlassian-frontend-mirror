/**
 * @jsxRuntime classic
 * @jsx jsx
 * @jsxFrag Fragment
 */

import { jsx } from '@compiled/react';

import AppProvider, { ThemeProvider } from '@atlaskit/app-provider';
import Button from '@atlaskit/button/new';
import { cssMap } from '@atlaskit/css';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import Heading from '@atlaskit/heading';
import { Box, Inline, Stack, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const contentStyles = cssMap({
	body: {
		paddingInline: token('space.500'),
		paddingBlock: token('space.200'),
		maxWidth: '760px',
	},
	section: {
		paddingBlockStart: token('space.300'),
		paddingInlineEnd: token('space.300'),
		paddingBlockEnd: token('space.300'),
		paddingInlineStart: token('space.300'),
		borderRadius: token('radius.xlarge'),
		overflow: 'hidden',
	},
});

/**
 * Sub-tree Theming Example
 *
 * This example demonstrates how to use ThemeProvider to create isolated theme contexts
 * within different parts of your application. Each ThemeProvider creates its own theme
 * scope that can override the parent theme settings.
 */
export function SubTreeThemingExample(): JSX.Element {
	return (
		<AppProvider
			defaultTheme={{ light: 'light', dark: 'dark', typography: 'typography' }}
			defaultColorMode="light"
		>
			<Stack xcss={contentStyles.body} space="space.400">
				<Heading as="h1" size="xxlarge">
					Koala & Co.
				</Heading>
				<Stack space="space.150">
					<Text as="p">
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum non corporis magni
						officiis. Commodi, iste ex. Explicabo, reiciendis ut soluta dicta impedit aperiam harum
						nihil ducimus vero perspiciatis id laudantium!
					</Text>
				</Stack>
				<ThemeProvider defaultColorMode="dark">
					<Box backgroundColor="elevation.surface" padding="space.300" xcss={contentStyles.section}>
						<Stack space="space.300">
							<Heading as="h2" size="large">
								Welcome to Sub-tree Theming
							</Heading>
							<Text as="p">
								This area should be completely in Dark Theme while the rest is Light Theme
							</Text>
							<Inline space="space.100">
								<Button>Hello World</Button>
								<DropdownMenu trigger="Dropdown menu">
									<DropdownItemGroup>
										<DropdownItem>Edit</DropdownItem>
										<DropdownItem>Share</DropdownItem>
										<DropdownItem>Move</DropdownItem>
										<DropdownItem>Clone</DropdownItem>
										<DropdownItem>Delete</DropdownItem>
										<DropdownItem>Report</DropdownItem>
									</DropdownItemGroup>
								</DropdownMenu>
								<DropdownMenu trigger="Dropdown menu (rendered to parent)" shouldRenderToParent>
									<DropdownItemGroup>
										<DropdownItem>Edit</DropdownItem>
										<DropdownItem>Share</DropdownItem>
										<DropdownItem>Move</DropdownItem>
										<DropdownItem>Clone</DropdownItem>
										<DropdownItem>Delete</DropdownItem>
										<DropdownItem>Report</DropdownItem>
									</DropdownItemGroup>
								</DropdownMenu>
							</Inline>
							<ThemeProvider defaultColorMode="light">
								<Box
									backgroundColor="elevation.surface"
									padding="space.300"
									xcss={contentStyles.section}
								>
									<Stack space="space.300">
										<Heading as="h2" size="large">
											Welcome to deeply-nested Sub-tree Theming
										</Heading>
										<Text as="p">
											This area should be completely in Light Theme while the rest is Dark Theme
										</Text>
										<Inline space="space.100">
											<Button>Hello World</Button>
											<DropdownMenu trigger="Dropdown menu" shouldRenderToParent>
												<DropdownItemGroup>
													<DropdownItem>Edit</DropdownItem>
													<DropdownItem>Share</DropdownItem>
													<DropdownItem>Move</DropdownItem>
													<DropdownItem>Clone</DropdownItem>
													<DropdownItem>Delete</DropdownItem>
													<DropdownItem>Report</DropdownItem>
												</DropdownItemGroup>
											</DropdownMenu>
											<DropdownMenu
												trigger="Dropdown menu (rendered to parent)"
												shouldRenderToParent
											>
												<DropdownItemGroup>
													<DropdownItem>Edit</DropdownItem>
													<DropdownItem>Share</DropdownItem>
													<DropdownItem>Move</DropdownItem>
													<DropdownItem>Clone</DropdownItem>
													<DropdownItem>Delete</DropdownItem>
													<DropdownItem>Report</DropdownItem>
												</DropdownItemGroup>
											</DropdownMenu>
										</Inline>
									</Stack>
								</Box>
							</ThemeProvider>
						</Stack>
					</Box>
				</ThemeProvider>
			</Stack>
		</AppProvider>
	);
}

export default SubTreeThemingExample;
