/**
 * @jsxRuntime classic
 * @jsx jsx
 * @jsxFrag Fragment
 */

import type { JSX } from 'react';

import { css, jsx } from '@compiled/react';

import { useColorMode } from '@atlaskit/app-provider/use-color-mode';
import { cssMap, cx } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled/box';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import { Text } from '@atlaskit/primitives/compiled/text';
import Radio from '@atlaskit/radio/radio';
import { token } from '@atlaskit/tokens';

import type { NavThemingMode } from './types';
import { calculateAccessibleForegroundColor, setColorLightnessByHct } from './utils/color-utils';

// eslint-disable-next-line @atlaskit/design-system/no-nested-styles
const optionStyles = css({
	display: 'flex',
	position: 'relative',
	alignItems: 'stretch',
	gap: token('space.075'),
	flexDirection: 'column',
	cursor: 'pointer',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- visually hides the ADS Radio under a card-style label
	'& > label': {
		position: 'absolute',
		zIndex: 1,
		inset: 0,
		cursor: 'pointer',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- visually hides the ADS Radio under a card-style label
		'& input[type="radio"]': {
			width: '0px',
			height: '0px',
			position: 'absolute',
			opacity: 0,
			pointerEvents: 'none',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- visually hides the ADS Radio under a card-style label
		'& > span': {
			display: 'none',
		},
	},
});

const pickerStyles = cssMap({
	optionsContainer: {
		display: 'grid',
		gridTemplateColumns: 'repeat(3, 1fr)',
		gap: token('space.100'),
	},
	optionCard: {
		borderRadius: token('radius.small'),
		display: 'flex',
		alignItems: 'stretch',
		transition: 'outline 0.2s',
		position: 'relative',
		overflow: 'hidden',
		outline: `${token('border.width')} solid ${token('color.border')}`,
		outlineOffset: 0,
	},
	optionCardSelected: {
		outlineColor: token('color.border.brand'),
		outlineWidth: token('border.width'),
		outlineOffset: token('space.025'),
	},
	optionLabel: {
		paddingInline: token('space.100'),
		textAlign: 'left',
	},
	thumbnailWrapper: {
		display: 'flex',
		width: '100%',
	},
	thumbnailSvg: {
		width: '100%',
		height: 'auto',
		display: 'block',
	},
});

/**
 * Generate SVG illustration for navigation theming mode
 */
export const NavThemingThumbnail = ({
	mode,
	brandColor,
	isDarkMode = false,
	size = 'normal',
}: {
	mode: NavThemingMode;
	brandColor: string;
	isDarkMode?: boolean;
	size?: 'small' | 'normal';
}): JSX.Element => {
	// For subtle mode, buttons and elements get brand color tinting set to lightness 60
	const accentColor =
		mode === 'subtle' ? setColorLightnessByHct(brandColor, 60, isDarkMode) : undefined;

	let topNavBg: string;
	let sideNavBg: string;
	let topNavFg: string;
	let sideNavFg: string;

	if (mode === 'none') {
		topNavBg = isDarkMode ? '#161A1D' : '#FFFFFF';
		sideNavBg = isDarkMode ? '#161A1D' : '#FFFFFF';
		topNavFg = isDarkMode ? '#9FADBC' : '#44546F';
		sideNavFg = isDarkMode ? '#9FADBC' : '#44546F';
	} else if (mode === 'subtle') {
		// Use default subtle lightness of 98 for the thumbnail (shows with nav background)
		topNavBg = setColorLightnessByHct(brandColor, 98, isDarkMode);
		sideNavBg = setColorLightnessByHct(brandColor, 98, isDarkMode);
		topNavFg = isDarkMode ? '#9FADBC' : '#44546F';
		sideNavFg = isDarkMode ? '#9FADBC' : '#44546F';
	} else {
		// bold - use accessible foreground color based on brand color
		topNavBg = brandColor;
		sideNavBg = brandColor;
		const accessibleFg = calculateAccessibleForegroundColor(brandColor);
		topNavFg = accessibleFg;
		sideNavFg = accessibleFg;
	}

	const buttonColor = mode === 'subtle' ? accentColor : undefined;
	// Content buttons and body text stay gray for all modes (not tinted with brand color)
	const contentButtonColor = isDarkMode ? '#5C6C7A' : '#8993A5';
	const textColor = isDarkMode ? '#2C333A' : '#DCDFE4';

	const width = size === 'small' ? '32' : '64';
	const height = size === 'small' ? '24' : '48';

	return (
		<svg
			width={width}
			height={height}
			viewBox="0 0 64 48"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			css={pickerStyles.thumbnailSvg}
		>
			{/* Background */}
			<rect x="0" y="0" width="64" height="48" rx="2.5" fill={isDarkMode ? '#161A1D' : '#FFFFFF'} />
			{/* Side nav */}
			<rect x="0" y="0" width="17" height="48" fill={sideNavBg} />
			{/* Top nav */}
			<rect x="0" y="0" width="64" height="7" fill={topNavBg} />
			{/* Top nav icons */}
			<rect x="5" y="3" width="8" height="2" rx="1" fill={buttonColor || topNavFg} />
			<rect x="15" y="3" width="8" height="2" rx="1" fill={buttonColor || topNavFg} />
			<rect x="25" y="3" width="8" height="2" rx="1" fill={buttonColor || topNavFg} />
			<rect x="52" y="3" width="8" height="2" rx="1" fill={buttonColor || topNavFg} />
			{/* Side nav items */}
			<rect x="5" y="13" width="8" height="2" rx="1" fill={buttonColor || sideNavFg} />
			<rect x="5" y="18" width="8" height="2" rx="1" fill={buttonColor || sideNavFg} />
			<rect x="5" y="23" width="8" height="2" rx="1" fill={buttonColor || sideNavFg} />
			{/* Content area borders - left and top edges */}
			<line
				x1="17"
				y1="7"
				x2="17"
				y2="48"
				stroke={isDarkMode ? '#2C333A' : '#DCDFE4'}
				strokeWidth="1"
			/>
			<line
				x1="17"
				y1="7"
				x2="64"
				y2="7"
				stroke={isDarkMode ? '#2C333A' : '#DCDFE4'}
				strokeWidth="1"
			/>
			{/* Content area */}
			<rect x="22" y="13" width="16" height="4" rx="2" fill={contentButtonColor} />
			<rect x="22" y="21" width="36" height="2" rx="1" fill={textColor} />
			<rect x="22" y="27" width="36" height="2" rx="1" fill={textColor} />
			<rect x="22" y="33" width="36" height="2" rx="1" fill={textColor} />
			<rect x="22" y="39" width="21" height="2" rx="1" fill={textColor} />
		</svg>
	);
};

type ThemingModeOption = {
	mode: NavThemingMode;
	label: string;
};

const themingModeOptions: ThemingModeOption[] = [
	{
		mode: 'none',
		label: 'None',
	},
	{
		mode: 'subtle',
		label: 'Tint',
	},
	{
		mode: 'bold',
		label: 'Colorful',
	},
];

export interface ThemingApproachPickerProps {
	navThemingMode: NavThemingMode;
	brandColor: string;
	onNavThemingModeChange: (mode: NavThemingMode) => void;
}

export const ThemingApproachPicker = ({
	navThemingMode,
	brandColor,
	onNavThemingModeChange,
}: ThemingApproachPickerProps): JSX.Element => {
	const resolvedColorMode = useColorMode();
	const isDarkMode = resolvedColorMode === 'dark';

	return (
		<Stack space="space.100">
			<Box xcss={pickerStyles.optionsContainer}>
				{themingModeOptions.map((option) => (
					<div key={option.mode} css={optionStyles}>
						<Radio
							name="nav-theming-mode"
							value={option.mode}
							isChecked={navThemingMode === option.mode}
							onChange={() => onNavThemingModeChange(option.mode)}
							aria-label={option.label}
						/>
						<Box
							xcss={cx(
								pickerStyles.optionCard,
								navThemingMode === option.mode && pickerStyles.optionCardSelected,
							)}
						>
							<Box xcss={pickerStyles.thumbnailWrapper}>
								<NavThemingThumbnail
									mode={option.mode}
									brandColor={brandColor}
									isDarkMode={isDarkMode}
								/>
							</Box>
						</Box>
						<Box xcss={pickerStyles.optionLabel}>
							<Text size="small" weight="medium">
								{option.label}
							</Text>
						</Box>
					</div>
				))}
			</Box>
		</Stack>
	);
};
