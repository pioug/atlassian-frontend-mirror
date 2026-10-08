/* eslint-disable @atlaskit/ui-styling-standard/no-global-styles */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useState } from 'react';

import { AppProvider } from '@atlaskit/app-provider/app-provider';
import { useColorMode } from '@atlaskit/app-provider/use-color-mode';
import { useSetColorMode } from '@atlaskit/app-provider/use-set-color-mode';
import Button from '@atlaskit/button/default/button';
import { jsx } from '@atlaskit/css';
import Heading from '@atlaskit/heading/heading';
import { Box } from '@atlaskit/primitives/compiled/box';
import { Inline } from '@atlaskit/primitives/compiled/inline';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import { Text } from '@atlaskit/primitives/compiled/text';
import type { CustomThemeOverrideRegistry } from '@atlaskit/tokens/custom-theme-overrides';

type DynamicInputs = CustomThemeOverrideRegistry['UNSAFE-dynamic']['light'];

function ColorInputs({
	mode,
	values,
	onChange,
}: {
	mode: 'Light' | 'Dark';
	values: DynamicInputs;
	onChange: (values: DynamicInputs) => void;
}) {
	return (
		<Stack space="space.050">
			<Heading as="h2" size="xsmall">
				{mode} mode
			</Heading>
			<Inline space="space.200">
				<label>
					Foreground{' '}
					<input
						type="color"
						value={values.dynamicForeground}
						onChange={(e) => onChange({ ...values, dynamicForeground: e.target.value })}
					/>
				</label>
				<label>
					Background{' '}
					<input
						type="color"
						value={values.dynamicBackground}
						onChange={(e) => onChange({ ...values, dynamicBackground: e.target.value })}
					/>
				</label>
			</Inline>
		</Stack>
	);
}

function ColorModeSwitch() {
	const colorMode = useColorMode();
	const setColorMode = useSetColorMode();

	return (
		<Inline space="space.100" alignBlock="center">
			<Text>Color mode: {colorMode}</Text>
			<Button onClick={() => setColorMode(colorMode === 'dark' ? 'light' : 'dark')}>
				Switch to {colorMode === 'dark' ? 'light' : 'dark'} mode
			</Button>
		</Inline>
	);
}

/**
 * Drives the `UNSAFE-dynamic` and `UNSAFE-dynamic-dark` themes from two input colours per mode.
 */
export default function CustomThemingExample(): React.JSX.Element {
	const [lightInputs, setLightInputs] = useState<DynamicInputs>({
		dynamicForeground: '#172b4d',
		dynamicBackground: '#ffffff',
	});
	const [darkInputs, setDarkInputs] = useState<DynamicInputs>({
		dynamicForeground: '#ffffff',
		dynamicBackground: '#1d2125',
	});

	return (
		<AppProvider
			defaultColorMode="light"
			defaultTheme={{
				light: { id: 'UNSAFE-dynamic', overrides: lightInputs },
				dark: { id: 'UNSAFE-dynamic-dark', overrides: darkInputs },
			}}
		>
			<Box padding="space.300">
				<Stack space="space.300">
					<Heading size="xxlarge">Custom theming</Heading>
					<ColorModeSwitch />
					<ColorInputs mode="Light" values={lightInputs} onChange={setLightInputs} />
					<ColorInputs mode="Dark" values={darkInputs} onChange={setDarkInputs} />
					<Box backgroundColor="elevation.surface.raised" padding="space.500">
						<Stack space="space.100">
							<Text color="color.text">
								Every colour token is derived from the foreground and background of the active
								colour mode.
							</Text>
							<Text color="color.text.subtle">Subtle text follows the same inputs.</Text>
							<Inline space="space.100">
								<Button appearance="primary">Primary action</Button>
								<Button>Secondary action</Button>
							</Inline>
						</Stack>
					</Box>
				</Stack>
			</Box>
		</AppProvider>
	);
}
