/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import type { ColorField } from '@atlaskit/editor-common/extensions';
import type { FeatureFlags } from '@atlaskit/editor-common/types';
import type { PaletteColor } from '@atlaskit/editor-common/ui-color';
import {
	chartsColorPaletteTooltipMessages,
	DEFAULT_BORDER_COLOR,
} from '@atlaskit/editor-common/ui-color';
import { ColorPickerButton } from '@atlaskit/editor-common/ui-menu';
import { Field } from '@atlaskit/form';
import { Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import FieldMessages from '../FieldMessages';
import type { OnFieldChange } from '../types';
import { validate } from '../utils';

/*
    NOTE: color used here are not yet in atlaskit code
    this is part of extended color pack from ADG, which is yet to be release
    at the time of writing this.

    Colour sequence source: https://product-fabric.atlassian.net/browse/ED-12650?focusedCommentId=204875
*/

export const colorPalette: PaletteColor[] = [
	{
		label: 'Light Blue',
		value: token('color.background.accent.blue.subtle', '#7AB2FF'),
	}, // 400
	{
		label: 'Light Green',
		value: token('color.background.accent.green.subtle', '#6BE1B0'),
	}, // 400
	{
		label: 'Light Yellow',
		value: token('color.background.accent.yellow.subtle', '#FFDB57'),
	}, // 400
	{
		label: 'Light Red',
		value: token('color.background.accent.red.subtle', '#FF8F73'),
	}, // 400
	{
		label: 'Light Purple',
		value: token('color.background.accent.purple.subtle', '#B5A7FB'),
	}, // 400

	{ label: 'Blue', value: token('color.chart.blue.bold', '#247FFF') }, // 600
	{ label: 'Green', value: token('color.chart.green.bold', '#23A971') }, // 600
	{ label: 'Yellow', value: token('color.chart.yellow.bold', '#FFBE33') }, // 600
	{ label: 'Red', value: token('color.chart.red.bold', '#FC552C') }, // 600
	{ label: 'Purple', value: token('color.chart.purple.bold', '#8B77EE') }, // 600

	{ label: 'Dark Blue', value: token('color.chart.blue.bolder', '#0055CC') }, // 800
	{ label: 'Dark Green', value: token('color.chart.green.bolder', '#177D52') }, // 800
	{
		label: 'Dark Yellow',
		value: token('color.chart.yellow.bolder', '#FF9D00'),
	}, // 800
	{ label: 'Dark Red', value: token('color.chart.red.bolder', '#D32D03') }, // 800
	{
		label: 'Dark Purple',
		value: token('color.chart.purple.bolder', '#5A43D0'),
	}, // 800

	{ label: 'Darker Blue', value: token('color.chart.blue.boldest', '#003884') }, // 1000
	{
		label: 'Darker Green',
		value: token('color.chart.green.boldest', '#055C3F'),
	}, // 1000
	{
		label: 'Darker Yellow',
		value: token('color.chart.yellow.boldest', '#946104'),
	}, // 1000
	{ label: 'Darker Red', value: token('color.chart.red.boldest', '#A32000') }, // 1000
	{
		label: 'Darker Purple',
		value: token('color.chart.purple.boldest', '#44368B'),
	}, // 1000
].map((color) => ({
	...color,
	border: DEFAULT_BORDER_COLOR,
}));

/**
 * Extended chart colors.
 * Decided here https://product-fabric.atlassian.net/wiki/spaces/EUXQ/pages/3477245015/Tokenising+table+charts+color
 */
export const extendedColorPalette: PaletteColor[] = [
	{ label: 'Darker Blue', value: token('color.chart.blue.boldest', '#003884') }, // 1000
	{ label: 'Darker Teal', value: token('color.chart.teal.boldest', '#206B74') }, // 1000
	{
		label: 'Darker Green',
		value: token('color.chart.green.boldest', '#055C3F'),
	}, // 1000
	{
		label: 'Darker Yellow',
		value: token('color.chart.yellow.boldest', '#946104'),
	}, // 1000
	{
		label: 'Darker Orange',
		value: token('color.chart.orange.boldest', '#974F0C'),
	}, // 1000
	{ label: 'Darker Red', value: token('color.chart.red.boldest', '#A32000') }, // 1000
	{
		label: 'Darker Magenta',
		value: token('color.chart.magenta.boldest', '#943D73'),
	}, // 1000
	{
		label: 'Darker Purple',
		value: token('color.chart.purple.boldest', '#44368B'),
	}, // 1000
	{ label: 'Darker Gray', value: token('color.chart.gray.boldest', '#44546F') }, // 1000

	{ label: 'Dark Blue', value: token('color.chart.blue.bolder', '#0055CC') }, // 800
	{ label: 'Dark Teal', value: token('color.chart.teal.bolder', '#1D7F8C') }, // 800
	{ label: 'Dark Green', value: token('color.chart.green.bolder', '#177D52') }, // 800
	{
		label: 'Dark Yellow',
		value: token('color.chart.yellow.bolder', '#FF9D00'),
	}, // 800
	{
		label: 'Dark Orange',
		value: token('color.chart.orange.bolder', '#B65C02'),
	}, // 800
	{ label: 'Dark Red', value: token('color.chart.red.bolder', '#D32D03') }, // 800
	{
		label: 'Dark Magenta',
		value: token('color.chart.magenta.bolder', '#CD519D'),
	}, // 800
	{
		label: 'Dark Purple',
		value: token('color.chart.purple.bolder', '#5A43D0'),
	}, // 800
	{ label: 'Dark Gray', value: token('color.chart.gray.bolder', '#758195') }, // 800

	{ label: 'Blue', value: token('color.chart.blue.bold', '#247FFF') }, // 600
	{ label: 'Teal', value: token('color.chart.teal.bold', '#1D9AAA') }, // 600
	{ label: 'Green', value: token('color.chart.green.bold', '#23A971') }, // 600
	{ label: 'Yellow', value: token('color.chart.yellow.bold', '#FFBE33') }, // 600
	{ label: 'Orange', value: token('color.chart.orange.bold', '#D97008') }, // 600
	{ label: 'Red', value: token('color.chart.red.bold', '#FC552C') }, // 600
	{ label: 'Magenta', value: token('color.chart.magenta.bold', '#DA62AC') }, // 600
	{ label: 'Purple', value: token('color.chart.purple.bold', '#8B77EE') }, // 600
	{ label: 'Gray', value: token('color.chart.gray.bold', '#8590A2') }, // 600

	{
		label: 'Light Blue',
		value: token('color.background.accent.blue.subtle', '#7AB2FF'),
	}, // 400
	{
		label: 'Light Teal',
		value: token('color.background.accent.teal.subtle', '#60C6D2'),
	}, // 400
	{
		label: 'Light Green',
		value: token('color.background.accent.green.subtle', '#6BE1B0'),
	}, // 400
	{
		label: 'Light Yellow',
		value: token('color.background.accent.yellow.subtle', '#FFDB57'),
	}, // 400
	{
		label: 'Light Orange',
		value: token('color.background.accent.orange.subtle', '#FAA53D'),
	}, // 400
	{
		label: 'Light Red',
		value: token('color.background.accent.red.subtle', '#FF8F73'),
	}, // 400
	{
		label: 'Light Magenta',
		value: token('color.background.accent.magenta.subtle', '#E774BB'),
	}, // 400
	{
		label: 'Light Purple',
		value: token('color.background.accent.purple.subtle', '#B5A7FB'),
	}, // 400
	{
		label: 'Light Gray',
		value: token('color.background.accent.gray.subtle', '#8993A5'),
	}, // 400
].map((color) => ({
	...color,
	border: DEFAULT_BORDER_COLOR,
}));

const colorPickerWrapperStyles = css({
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
	height: token('space.400', '32px'),
	paddingRight: token('space.100', '8px'),
});

const colorPickerLabelStyles = css({
	font: token('font.body'),
});

interface Props {
	name: string;
	title: string;
	currentColor: string;
	onChange: (color: string) => void;
	onFieldChange: OnFieldChange;
	featureFlags?: FeatureFlags;
}

export const EXPANDED_COLOR_PICKER_COLUMNS = 9;
export const ORIGINAL_COLOR_PICKER_COLUMNS = 5;

const ColorPicker = (props: Props) => {
	const { name, title, currentColor, onChange, onFieldChange } = props;

	const onColorChange = (color: PaletteColor) => {
		const colorValue = color.value;

		onChange(colorValue);
		onFieldChange(name, currentColor !== colorValue);
	};

	return (
		<ColorPickerButton
			title={title}
			currentColor={currentColor}
			onChange={onColorChange}
			colorPalette={extendedColorPalette}
			paletteColorTooltipMessages={chartsColorPaletteTooltipMessages}
			cols={EXPANDED_COLOR_PICKER_COLUMNS}
			alignX="right"
			placement="ConfigPanel"
			size={{
				width: token('space.300', '24px'),
				height: token('space.300', '24px'),
			}}
			/* ED-18288 We align the palette to the right edge which is 1.5rem spacing away to avoid
        excess overflow on left. Additional 1 is to mitigate 1px added by floating toolbar. */
			// Disabling design token check as this is a calculated value
			// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview
			absoluteOffset={{ right: Number(-1.5 * getCurrentRemSize() - 1) }}
		/>
	);
};

const ColorPickerField = ({
	name,
	field,
	onFieldChange,
	featureFlags,
}: {
	name: string;
	field: ColorField;
	onFieldChange: OnFieldChange;
	featureFlags?: FeatureFlags;
}) => {
	const { label, defaultValue, isRequired, isDisabled } = field;

	return (
		<Field
			name={name}
			isRequired={isRequired}
			defaultValue={defaultValue}
			testId={`config-panel-color-picker-${name}`}
			validate={(value?: string) => validate<string>(field, value || '')}
			isDisabled={isDisabled}
		>
			{({ fieldProps, error }) => (
				<Fragment>
					<div css={colorPickerWrapperStyles}>
						<label css={colorPickerLabelStyles}>
							{label}
							{isRequired && (
								<Text color="color.text.danger" aria-hidden="true">
									*
								</Text>
							)}
						</label>
						<ColorPicker
							name={name}
							title={label}
							currentColor={fieldProps.value}
							onChange={fieldProps.onChange}
							onFieldChange={onFieldChange}
							featureFlags={featureFlags}
						/>
					</div>
					{error && <FieldMessages error={error} description="" />}
				</Fragment>
			)}
		</Field>
	);
};

const getCurrentRemSize = (): number => {
	const fallback = 16; // 16px is the default rem size for most browsers
	if (typeof document === 'undefined' || typeof getComputedStyle === 'undefined') {
		return fallback;
	}
	const value = parseFloat(getComputedStyle(document.documentElement).fontSize);
	return value || fallback;
};

export default ColorPickerField;
