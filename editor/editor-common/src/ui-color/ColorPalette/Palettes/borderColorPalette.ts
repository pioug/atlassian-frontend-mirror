import { borderColorPalette as colorPalette } from '@atlaskit/adf-schema';

import { DEFAULT_BORDER_COLOR } from './common';
import getColorMessage from './getColorMessage';
import paletteMessages from './paletteMessages';
import { type PaletteColor } from './type';

const borderColorPalette: Array<PaletteColor> = [];

colorPalette.forEach((label, color) => {
	const key = label.toLowerCase().replace(' ', '-');
	const message = getColorMessage(paletteMessages, key);

	borderColorPalette.push({
		value: color,
		label,
		border: DEFAULT_BORDER_COLOR,
		message,
	});
});

export default borderColorPalette;
