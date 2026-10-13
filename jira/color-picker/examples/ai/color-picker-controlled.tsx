import React from 'react';

import { IntlProvider } from 'react-intl';

import ColorPicker from '@atlaskit/color-picker/ColorPicker';
import { ColorPickerWithoutAnalytics } from '@atlaskit/color-picker/ColorPicker';
import type { Props as ColorPickerProps } from '@atlaskit/color-picker/ColorPicker';

const palette: ColorPickerProps['palette'] = [
	{ label: 'Blue', value: '#0052CC' },
	{ label: 'Green', value: '#00875A' },
	{ label: 'Purple', value: '#6554C0' },
];

export default function ColorPickerControlled(): React.JSX.Element {
	const [color, setColor] = React.useState(palette[0].value);
	const [plainColor, setPlainColor] = React.useState(palette[1].value);

	return (
		<IntlProvider locale="en">
			<div>
				<h2>Card color</h2>
				<ColorPicker
					label="Card background color"
					palette={palette}
					selectedColor={color}
					onChange={setColor}
				/>
				<p role="status">
					Selected card color: {palette.find((option) => option.value === color)?.label}
				</p>

				<h2>Without analytics wrapper</h2>
				<ColorPickerWithoutAnalytics
					label="Tag color"
					palette={palette}
					selectedColor={plainColor}
					onChange={setPlainColor}
				/>
				<p role="status">
					Selected tag color: {palette.find((option) => option.value === plainColor)?.label}
				</p>
			</div>
		</IntlProvider>
	);
}
