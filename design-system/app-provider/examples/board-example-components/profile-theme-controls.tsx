/**
 * @jsxRuntime classic
 * @jsx jsx
 * @jsxFrag Fragment
 */

import { type JSX, useCallback, useEffect, useState } from 'react';

import { jsx } from '@compiled/react';
import { bind } from 'bind-event-listener';

import { useSetColorMode } from '@atlaskit/app-provider/use-set-color-mode';
import { cssMap } from '@atlaskit/css';
import DropdownItemRadio from '@atlaskit/dropdown-menu/dropdown-item-radio';
import DropdownItemRadioGroup from '@atlaskit/dropdown-menu/dropdown-item-radio-group';
import { Inline } from '@atlaskit/primitives/compiled/inline';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import { Text } from '@atlaskit/primitives/compiled/text';
import { token } from '@atlaskit/tokens';

import DarkThumb from '../assets/DarkThumb.svg';
import LightThumb from '../assets/LightThumb.svg';

const themeThumbnailStyles = cssMap({
	thumbnail: {
		width: '4rem',
		height: '3rem',
		borderRadius: token('radius.small'),
	},
});

type ThemeColorModes = 'light' | 'dark' | 'auto';

type ThemeConfigData = {
	label: string;
	description?: string;
	image: string;
};

const colorModeData: Record<ThemeColorModes, ThemeConfigData> = {
	light: {
		label: 'Light',
		image: LightThumb,
	},
	dark: {
		label: 'Dark',
		image: DarkThumb,
	},
	auto: {
		label: 'Match browser',
		image: LightThumb,
	},
};

/**
 * Theme thumbnail component
 */
const ThemeThumbnail = ({ src }: { src: string }) => (
	// eslint-disable-next-line @atlaskit/design-system/no-html-image
	<img src={src} alt="" css={themeThumbnailStyles.thumbnail} />
);

/**
 * Theme controls component for profile dropdown
 * Must be used inside AppProvider to access useSetColorMode
 */
export const ProfileThemeControls = ({
	currentColorMode,
	onColorModeChange,
}: {
	currentColorMode: ThemeColorModes;
	onColorModeChange: (mode: ThemeColorModes) => void;
}): JSX.Element => {
	const setAppProviderColorMode = useSetColorMode();
	const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light');

	// Watch for system color mode changes
	useEffect(() => {
		if (typeof window !== 'undefined' && window.matchMedia) {
			const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
			setSystemTheme(mediaQuery.matches ? 'dark' : 'light');

			const unbind = bind(mediaQuery, {
				type: 'change',
				listener: (e: MediaQueryListEvent) => {
					setSystemTheme(e.matches ? 'dark' : 'light');
				},
			});

			return unbind;
		}
	}, []);

	const handleColorModeChange = useCallback(
		(mode: ThemeColorModes) => {
			setAppProviderColorMode(mode);
			onColorModeChange(mode);
		},
		[setAppProviderColorMode, onColorModeChange],
	);

	return (
		<DropdownItemRadioGroup id="color-mode" title="Color mode">
			{Object.entries(colorModeData).map(([mode, metadata]) => (
				<DropdownItemRadio
					id={mode}
					key={mode}
					isSelected={currentColorMode === mode}
					onClick={() => handleColorModeChange(mode as ThemeColorModes)}
				>
					<Inline space="space.150" alignBlock="center">
						<ThemeThumbnail
							src={colorModeData[mode === 'auto' ? systemTheme : (mode as ThemeColorModes)].image}
						/>
						<Stack>
							<Text weight="medium">{metadata.label}</Text>
							{metadata.description && (
								<Text size="small" color="color.text.subtle">
									{metadata.description}
								</Text>
							)}
						</Stack>
					</Inline>
				</DropdownItemRadio>
			))}
		</DropdownItemRadioGroup>
	);
};

export type { ThemeColorModes };
