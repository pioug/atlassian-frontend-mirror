/**
 * @jsxRuntime classic
 * @jsx jsx
 * @jsxFrag Fragment
 */

import type { JSX } from 'react';

import { css, jsx } from '@compiled/react';

import { cssMap, cx } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled/box';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import { Text } from '@atlaskit/primitives/compiled/text';
import Radio from '@atlaskit/radio/radio';
import { token } from '@atlaskit/tokens';

import colorModeAutoUrl from '../assets/color-mode-auto.svg';
import colorModeDarkUrl from '../assets/color-mode-dark.svg';
import colorModeLightUrl from '../assets/color-mode-light.svg';

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
		position: 'relative',
	},
	thumbnailImage: {
		width: '100%',
		height: 'auto',
		display: 'block',
	},
});

type ColorModeOption = {
	mode: 'light' | 'dark' | 'auto';
	label: string;
	description: string;
};

const colorModeOptions: ColorModeOption[] = [
	{
		mode: 'light',
		label: 'Light',
		description: 'Light color scheme',
	},
	{
		mode: 'dark',
		label: 'Dark',
		description: 'Dark color scheme',
	},
	{
		mode: 'auto',
		label: 'Auto',
		description: 'Match browser',
	},
];

export interface ColorModePickerProps {
	colorMode: 'light' | 'dark' | 'auto';
	onColorModeChange: (mode: 'light' | 'dark' | 'auto') => void;
}

export const ColorModePicker = ({
	colorMode,
	onColorModeChange,
}: ColorModePickerProps): JSX.Element => {
	return (
		<Stack space="space.100">
			<Box xcss={pickerStyles.optionsContainer}>
				{colorModeOptions.map((option) => (
					<div key={option.mode} css={optionStyles}>
						<Radio
							name="color-mode"
							value={option.mode}
							isChecked={colorMode === option.mode}
							onChange={() => onColorModeChange(option.mode)}
							aria-label={option.label}
						/>
						<Box
							xcss={cx(
								pickerStyles.optionCard,
								colorMode === option.mode && pickerStyles.optionCardSelected,
							)}
						>
							<Box xcss={pickerStyles.thumbnailWrapper}>
								{/* eslint-disable-next-line @atlaskit/design-system/no-html-image */}
								<img
									alt={option.label}
									src={
										option.mode === 'light'
											? colorModeLightUrl
											: option.mode === 'dark'
												? colorModeDarkUrl
												: colorModeAutoUrl
									}
									css={pickerStyles.thumbnailImage}
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
