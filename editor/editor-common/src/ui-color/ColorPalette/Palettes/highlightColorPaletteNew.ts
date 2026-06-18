import { backgroundColorPaletteNew } from '@atlaskit/adf-schema/background-color';
import { token } from '@atlaskit/tokens';

import getColorMessage from './getColorMessage';
import { REMOVE_HIGHLIGHT_COLOR } from './highlightColorPalette';
import { mapPaletteColor } from './mapPaletteColor';
import paletteMessages from './paletteMessages';
import type { PaletteColor } from './type';

export const highlightColorPaletteNew: Array<PaletteColor> = [
	{
		value: REMOVE_HIGHLIGHT_COLOR,
		label: 'No color' as const, // Mostly informative, only used for analytics
		border: token('color.border'),
		message: getColorMessage(paletteMessages, 'no-color'),
	},
];

backgroundColorPaletteNew.forEach((label, color) => {
	highlightColorPaletteNew.push(mapPaletteColor(label, color));
});
