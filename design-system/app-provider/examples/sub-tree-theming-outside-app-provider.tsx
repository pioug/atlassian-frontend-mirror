/**
 * @jsxRuntime classic
 * @jsx jsx
 * @jsxFrag Fragment
 */
import { useEffect } from 'react';

import {
	ThemeProvider,
	useColorMode,
	useSetColorMode,
	useSetTheme,
	useTheme,
} from '@atlaskit/app-provider';
import Button from '@atlaskit/button/new';
import { Code } from '@atlaskit/code';
import { cssMap, jsx } from '@atlaskit/css';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import { Label } from '@atlaskit/form';
import Heading from '@atlaskit/heading';
import { Box, Inline, Stack, Text } from '@atlaskit/primitives/compiled';
import Select from '@atlaskit/select';
import Tile from '@atlaskit/tile';
import { type ThemeColorModes, type ThemeIds, type ThemeState, token } from '@atlaskit/tokens';

const contentStyles = cssMap({
	body: {
		paddingInline: token('space.500'),
		paddingBlock: token('space.500'),
		backgroundColor: token('elevation.surface'),
		maxWidth: '760px',
	},
	section: {
		paddingBlockStart: token('space.300'),
		paddingInlineEnd: token('space.300'),
		paddingBlockEnd: token('space.300'),
		paddingInlineStart: token('space.300'),
		borderRadius: token('radius.xlarge'),
		backgroundColor: token('elevation.surface'),
	},
});

const Palette = () => {
	return (
		<Inline space="space.100">
			<Tile backgroundColor="color.background.accent.red.subtle" label="Red Subtle" />
			<Tile backgroundColor="color.background.accent.orange.subtle" label="Orange Subtle" />
			<Tile backgroundColor="color.background.accent.yellow.subtle" label="Yellow Subtle" />
			<Tile backgroundColor="color.background.accent.lime.subtle" label="Lime Subtle" />
			<Tile backgroundColor="color.background.accent.green.subtle" label="Green Subtle" />
			<Tile backgroundColor="color.background.accent.teal.subtle" label="Teal Subtle" />
			<Tile backgroundColor="color.background.accent.blue.subtle" label="Blue Subtle" />
			<Tile backgroundColor="color.background.accent.purple.subtle" label="Purple Subtle" />
			<Tile backgroundColor="color.background.accent.magenta.subtle" label="Magenta Subtle" />
		</Inline>
	);
};

const PlainElement = () => {
	return (
		<p>I'm a plain paragraph. I rely on global styles from the CSS reset.</p>
	);
};

export function SubTreeThemingExample(): JSX.Element {
	return (
		<ThemeProvider defaultColorMode="auto">
			<Stack xcss={contentStyles.body} space="space.400">
				<Heading as="h1" size="xxlarge">
					Sub-tree theming outside AppProvider
				</Heading>
				<Stack space="space.150">
					<Text as="p">
						This example is not wrapped in an AppProvider. In this case we treat each ThemeProvider
						as a sub-tree theme. If you switch on dark-mode through system preferences, you'll see
						why we need AppProvider to set the global theme state as the full page will not have a
						background color.
					</Text>
				</Stack>
				<ThemeProvider defaultColorMode="dark">
					<Box padding="space.300" xcss={contentStyles.section}>
						<Stack space="space.300">
							<Heading as="h2" size="large">
								Welcome to Sub-tree Theming
							</Heading>
							<PlainElement />
							<Palette />
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
										<PlainElement />
										<Palette />
										<Text as="p">
											This area should be completely in Light Theme while the rest is Dark Theme
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

				<InvertedColorMode />
				<ControlledSubtreeTheme />
			</Stack>
		</ThemeProvider>
	);
}

const InvertedColorModeContent = ({ parentColorMode }: { parentColorMode: ThemeColorModes }) => {
	const setColorMode = useSetColorMode();

	useEffect(() => {
		setColorMode(parentColorMode === 'light' ? 'dark' : 'light');
	}, [parentColorMode, setColorMode]);

	return (
		<Box padding="space.300" xcss={contentStyles.section}>
			<Stack space="space.300">
				<Heading as="h2" size="large">
					This section will invert the root theme
				</Heading>
				<PlainElement />
				<Palette />
				<Text as="p">
					It will swap to be the opposite of the color mode, so it always stands out. Currently the
					most reliable method for this is to use provided hooks to listen to changes to the parent
					color mode, rather than theme provider's <Code>defaultTheme</Code> prop – which always
					swaps between light and dark mode according to system preferences, even if the user's root
					color mode preference is not
					<Code>auto</Code>.
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
			</Stack>
		</Box>
	);
};

const InvertedColorMode = () => {
	const colorMode = useColorMode();

	return (
		<ThemeProvider>
			<InvertedColorModeContent parentColorMode={colorMode} />
		</ThemeProvider>
	);
};

const colorThemeOptions: { label: string; value: ThemeIds }[] = [
	{ label: 'Light', value: 'light' },
	{ label: 'Dark', value: 'dark' },
];

const colorModeOptions: { label: string; value: ThemeColorModes }[] = [
	{ label: 'Light', value: 'light' },
	{ label: 'Dark', value: 'dark' },
	{ label: 'Auto', value: 'auto' },
];

const ControlledSubtreeThemeContent = () => {
	const colorMode = useColorMode();
	const setColorMode = useSetColorMode();

	const colorTheme = useTheme();
	const setTheme = useSetTheme();

	return (
		<Box padding="space.300" xcss={contentStyles.section}>
			<Stack space="space.300">
				<Heading as="h2" size="large">
					This section allows control of the sub-tree theme
				</Heading>
				<Text as="p">Theme stylesheets will be loaded as required.</Text>
				<Heading as="h3" size="medium">
					Color
				</Heading>
				<PlainElement />
				<Palette />
				<div>
					<Label htmlFor="light-color-theme">Light theme</Label>
					<Select
						inputId="light-color-theme"
						options={colorThemeOptions}
						value={colorThemeOptions.find((option) => option.value === colorTheme?.light)}
						onChange={(option) =>
							option?.value
								? setTheme({
									light: option.value as ThemeState['light'],
								})
								: undefined
						}
					/>
				</div>
				<div>
					<Label htmlFor="dark-color-theme">Dark theme</Label>
					<Select
						inputId="dark-color-theme"
						options={colorThemeOptions}
						value={colorThemeOptions.find((option) => option.value === colorTheme?.dark)}
						onChange={(option) =>
							option?.value
								? setTheme({
									dark: option.value as ThemeState['dark'],
								})
								: undefined
						}
					/>
				</div>
				<div>
					<Label htmlFor="color-mode">Color mode</Label>
					<Select
						inputId="color-mode"
						options={colorModeOptions}
						value={colorModeOptions.find((option) => option.value === colorMode)}
						onChange={(option) => (option?.value ? setColorMode(option.value) : undefined)}
					/>
				</div>
			</Stack>
		</Box>
	);
};

const ControlledSubtreeTheme = () => {
	return (
		<ThemeProvider defaultColorMode="dark">
			<ControlledSubtreeThemeContent />
		</ThemeProvider>
	);
};

export default SubTreeThemingExample;
