import React from 'react';

import { IntlProvider } from 'react-intl';

import ColorPaletteMenu from '@atlaskit/color-picker/ColorPaletteMenu';
import { ColorPaletteMenuWithoutAnalytics } from '@atlaskit/color-picker/ColorPaletteMenu';
import type { Props as ColorPaletteMenuProps } from '@atlaskit/color-picker/ColorPaletteMenu';

const palette: ColorPaletteMenuProps['palette'] = [
	{ label: 'Blue', value: '#0052CC' },
	{ label: 'Green', value: '#00875A' },
	{ label: 'Purple', value: '#6554C0' },
];

export default function ColorPaletteMenuControlled(): React.JSX.Element {
	const [color, setColor] = React.useState(palette[0].value);
	const [plainColor, setPlainColor] = React.useState(palette[1].value);

	return (
		<IntlProvider locale="en">
			<div>
				<h2>Board label color</h2>
				<ColorPaletteMenu
					label="Board label color"
					palette={palette}
					selectedColor={color}
					cols={3}
					isInsideMenu={false}
					isFocusLockEnabled={false}
					onChange={(_event, nextColor) => setColor(nextColor)}
				/>
				<p role="status">
					Selected board label color: {palette.find((option) => option.value === color)?.label}
				</p>

				<h2>Without analytics wrapper</h2>
				<ColorPaletteMenuWithoutAnalytics
					label="Milestone color"
					palette={palette}
					selectedColor={plainColor}
					cols={3}
					isInsideMenu={false}
					isFocusLockEnabled={false}
					autoFocus={false}
					onChange={(_event, nextColor) => setPlainColor(nextColor)}
				/>
				<p role="status">
					Selected milestone color: {palette.find((option) => option.value === plainColor)?.label}
				</p>
			</div>
		</IntlProvider>
	);
}
