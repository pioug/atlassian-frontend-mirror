import { tableBackgroundBorderColor, tableBackgroundColorPalette } from '@atlaskit/adf-schema';

import getColorMessage from './getColorMessage';
import paletteMessages from './paletteMessages';
import { type PaletteColor } from './type';

const cellBackgroundColorPalette: Array<PaletteColor> = [];

tableBackgroundColorPalette.forEach((label, color) => {
	const key = label.toLowerCase().replace(' ', '-');
	const message = getColorMessage(paletteMessages, key);

	cellBackgroundColorPalette.push({
		value: color,
		label,
		border: tableBackgroundBorderColor,
		message,
	});
});

export default cellBackgroundColorPalette;
