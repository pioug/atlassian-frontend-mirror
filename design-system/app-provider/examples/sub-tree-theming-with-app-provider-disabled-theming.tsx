/**
 * @jsxRuntime classic
 * @jsx jsx
 * @jsxFrag Fragment
 */
import { useEffect } from 'react';

import AppProvider, { ThemeProvider, useColorMode, useSetColorMode } from '@atlaskit/app-provider';
import Button from '@atlaskit/button/new';
import { Code } from '@atlaskit/code';
import { cssMap, jsx } from '@atlaskit/css';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import Heading from '@atlaskit/heading';
import { Box, Inline, Stack, Text } from '@atlaskit/primitives/compiled';
import Tile from '@atlaskit/tile';
import { type ThemeColorModes, token } from '@atlaskit/tokens';

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

export function SubTreeThemingExample(): JSX.Element {
	return (
		<AppProvider defaultColorMode="auto" UNSAFE_isThemingDisabled>
			<Stack xcss={contentStyles.body} space="space.400">
				<Heading as="h1" size="xxlarge">
					Sub-tree theming inside AppProvider (disabled theming)
				</Heading>
				<InvertedColorMode />
			</Stack>
		</AppProvider>
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

export default SubTreeThemingExample;
