import { backgroundColorPalette } from '@atlaskit/adf-schema';

import { DEFAULT_BORDER_COLOR } from './common';
import getColorMessage from './getColorMessage';
import paletteMessages from './paletteMessages';
import { mapPaletteColor } from './textColorPalette';
import type { PaletteColor } from './type';

export const REMOVE_HIGHLIGHT_COLOR = '#00000000';
export const highlightColorPalette: Array<PaletteColor> = [
	{
		value: REMOVE_HIGHLIGHT_COLOR,
		label: 'No color', // Mostly informative, only used for analytics
		border: DEFAULT_BORDER_COLOR,
		message: getColorMessage(paletteMessages, 'no-color'),
	},
];

backgroundColorPalette.forEach((label, color) => {
	highlightColorPalette.push(mapPaletteColor(label, color));
});
