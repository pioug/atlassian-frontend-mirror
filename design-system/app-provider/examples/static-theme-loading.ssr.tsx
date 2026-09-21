/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useState } from 'react';

import { AppProvider } from '@atlaskit/app-provider/app-provider';
import { ThemeProvider } from '@atlaskit/app-provider/theme-provider';
import { useColorMode } from '@atlaskit/app-provider/use-color-mode';
import { useSetColorMode } from '@atlaskit/app-provider/use-set-color-mode';
import { useSetTheme } from '@atlaskit/app-provider/use-set-theme';
import { useTheme } from '@atlaskit/app-provider/use-theme';
import Button from '@atlaskit/button/default/button';
import { cssMap, jsx } from '@atlaskit/css';
import Heading from '@atlaskit/heading/heading';
import { Box } from '@atlaskit/primitives/compiled/box';
import { Inline } from '@atlaskit/primitives/compiled/inline';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import { Text } from '@atlaskit/primitives/compiled/text';
import { token } from '@atlaskit/tokens';
import type { ThemeColorModes } from '@atlaskit/tokens/theme-color-modes';
import { themeObjectToString } from '@atlaskit/tokens/theme-object-to-string';

const standardTheme = { light: 'light', dark: 'dark' } as const;
const testTheme = { light: 'UNSAFE-test-light', dark: 'UNSAFE-test-dark' } as const;

const pageStyles = cssMap({
	root: {
		maxWidth: '1120px',
		marginBlockEnd: '0',
		marginBlockStart: '0',
		marginInlineEnd: 'auto',
		marginInlineStart: 'auto',
		paddingBlockEnd: token('space.400'),
		paddingBlockStart: token('space.400'),
		paddingInlineEnd: token('space.400'),
		paddingInlineStart: token('space.400'),
	},
});

const panelStyles = cssMap({
	root: {
		borderColor: token('color.border'),
		borderRadius: token('radius.large'),
		borderStyle: 'solid',
		borderWidth: token('border.width'),
		boxShadow: token('elevation.shadow.raised'),
		paddingBlockEnd: token('space.300'),
		paddingBlockStart: token('space.300'),
		paddingInlineEnd: token('space.300'),
		paddingInlineStart: token('space.300'),
	},
});

type ThemeChoice = 'standard' | 'test';
/*
 * TODO: Restore the spacing and typography controls in their follow-up change.
 * They are intentionally excluded from the static-theme-loading feature work.
 *
 * type SpacingChoice = 'standard' | 'compact' | 'spacious';
 * type TypographyChoice = 'standard' | 'playful' | 'mono';
 */

function ThemeControls({
	initialThemeChoice,
}: {
	initialThemeChoice: ThemeChoice;
}): React.JSX.Element {
	const theme = useTheme();
	const colorMode = useColorMode();
	const setColorMode = useSetColorMode();
	const setTheme = useSetTheme();
	const [themeChoice, setThemeChoice] = useState<ThemeChoice>(initialThemeChoice);
	/*
	 * TODO: Restore these states with the deferred spacing and typography controls.
	 * const [spacingChoice, setSpacingChoice] = useState<SpacingChoice>('standard');
	 * const [typographyChoice, setTypographyChoice] = useState<TypographyChoice>('standard');
	 */

	const chooseTheme = (choice: ThemeChoice) => {
		setTheme(choice === 'test' ? testTheme : standardTheme);
		setThemeChoice(choice);
	};

	return (
		<Stack space="space.150">
			<Inline space="space.100" alignBlock="center">
				<Text weight="bold">{themeObjectToString(theme)}</Text>
			</Inline>
			<Inline space="space.100" alignBlock="center">
				<Text weight="bold">Color mode</Text>
				<Button
					appearance={colorMode === 'light' ? 'primary' : 'subtle'}
					onClick={() => setColorMode('light')}
				>
					Light
				</Button>
				<Button
					appearance={colorMode === 'dark' ? 'primary' : 'subtle'}
					onClick={() => setColorMode('dark')}
				>
					Dark
				</Button>
			</Inline>
			<Inline space="space.100" alignBlock="center">
				<Text weight="bold">Theme CSS</Text>
				<Button
					appearance={themeChoice === 'test' ? 'primary' : 'subtle'}
					onClick={() => chooseTheme('test')}
				>
					Test palette
				</Button>
				<Button
					appearance={themeChoice === 'standard' ? 'primary' : 'subtle'}
					onClick={() => chooseTheme('standard')}
				>
					Default palette
				</Button>
			</Inline>
			{/*
				TODO: Restore the deferred spacing controls in their follow-up change.
				<Inline space="space.100" alignBlock="center">
					<Text weight="bold">Spacing</Text>
					<Button
						appearance={spacingChoice === 'standard' ? 'primary' : 'subtle'}
						onClick={() => {
							setTheme({ spacing: 'spacing' });
							setSpacingChoice('standard');
						}}
					>
						Standard
					</Button>
					<Button
						appearance={spacingChoice === 'compact' ? 'primary' : 'subtle'}
						onClick={() => {
							setTheme({ spacing: 'spacing-compact' });
							setSpacingChoice('compact');
						}}
					>
						Compact
					</Button>
					<Button
						appearance={spacingChoice === 'spacious' ? 'primary' : 'subtle'}
						onClick={() => {
							setTheme({ spacing: 'spacing-spacious' });
							setSpacingChoice('spacious');
						}}
					>
						Spacious
					</Button>
				</Inline>
			*/}
			{/*
				TODO: Restore the deferred typography controls in their follow-up change.
				<Inline space="space.100" alignBlock="center">
					<Text weight="bold">Typography</Text>
					<Button
						appearance={typographyChoice === 'standard' ? 'primary' : 'subtle'}
						onClick={() => {
							setTheme({ typography: 'typography' });
							setTypographyChoice('standard');
						}}
					>
						Standard
					</Button>
					<Button
						appearance={typographyChoice === 'playful' ? 'primary' : 'subtle'}
						onClick={() => {
							setTheme({ typography: 'typography-playful' });
							setTypographyChoice('playful');
						}}
					>
						Playful
					</Button>
					<Button
						appearance={typographyChoice === 'mono' ? 'primary' : 'subtle'}
						onClick={() => {
							setTheme({ typography: 'typography-mono' });
							setTypographyChoice('mono');
						}}
					>
						Monospace
					</Button>
				</Inline>
			*/}
		</Stack>
	);
}

function StickerSheet({
	label,
	depth,
	initialThemeChoice,
}: {
	label: string;
	depth: number;
	initialThemeChoice: ThemeChoice;
}): React.JSX.Element {
	const colorMode = useColorMode() as ThemeColorModes;

	return (
		<React.Fragment>
			<Stack space="space.250">
				<Stack space="space.100">
					<Text weight="bold">{label}</Text>
					<Text color="color.text.subtle">
						Nested provider depth {depth} · active mode: {colorMode}
					</Text>
				</Stack>
				<ThemeControls initialThemeChoice={initialThemeChoice} />
			</Stack>
		</React.Fragment>
	);
}

/**
 * React 19 streaming-SSR fixture for platform-static-theme-loading.
 */
export default function StaticThemeLoadingSsrExample(): React.JSX.Element {
	return (
		<AppProvider defaultColorMode="light">
			<main css={pageStyles.root}>
				<Stack space="space.300">
					<Stack space="space.100">
						<Heading size="xxlarge">Nested theme sticker sheet</Heading>
						<Text color="color.text.subtle">
							Each panel owns its color-mode and CSS theme controls.
						</Text>
					</Stack>

					<ThemeProvider defaultTheme={testTheme}>
						<Box backgroundColor="elevation.surface" xcss={panelStyles.root}>
							<Stack space="space.200">
								<StickerSheet
									label="Test theme — first region"
									depth={1}
									initialThemeChoice="test"
								/>
								<ThemeProvider defaultTheme={standardTheme} defaultColorMode="dark">
									<Box backgroundColor="elevation.surface" xcss={panelStyles.root}>
										<Stack space="space.200">
											<StickerSheet
												label="Default theme — nested inside test"
												depth={2}
												initialThemeChoice="standard"
											/>
											<ThemeProvider defaultTheme={testTheme}>
												<Box backgroundColor="elevation.surface" xcss={panelStyles.root}>
													<StickerSheet
														label="Test theme — deeply nested"
														depth={3}
														initialThemeChoice="test"
													/>
												</Box>
											</ThemeProvider>
										</Stack>
									</Box>
								</ThemeProvider>
							</Stack>
						</Box>
					</ThemeProvider>

					<ThemeProvider defaultTheme={testTheme}>
						<Box backgroundColor="elevation.surface" xcss={panelStyles.root}>
							<StickerSheet
								label="Test theme — second independent region"
								depth={1}
								initialThemeChoice="test"
							/>
						</Box>
					</ThemeProvider>
				</Stack>
			</main>
		</AppProvider>
	);
}
