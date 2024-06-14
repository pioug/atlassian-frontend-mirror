import { colorPalette } from '@atlaskit/adf-schema';
import { token } from '@atlaskit/tokens';

import { DEFAULT_BORDER_COLOR } from './common';
import getColorMessage from './getColorMessage';
import paletteMessages from './paletteMessages';
import type { PaletteColor } from './type';

export const mapPaletteColor = (label: string, color: string) => {
	const key = label.toLowerCase().replace(' ', '-');
	const message = getColorMessage(paletteMessages, key);
	return {
		value: color,
		label,
		border: DEFAULT_BORDER_COLOR,
		message,
	};
};

// row 1
export const textColorPalette: Array<PaletteColor> = [];

export const textColorPaletteTokenBorders: Array<PaletteColor> = [];

colorPalette.forEach((label, color) => {
	textColorPalette.push(mapPaletteColor(label, color));
});

export const textColorPaletteWithTokenBorders: Array<PaletteColor> = textColorPalette.map(
	(paletteColor) => ({
		...paletteColor,
		border: token('color.border', '#091E4224'),
	}),
);
