import { tableBackgroundBorderColor, tableBackgroundColorPalette } from '@atlaskit/adf-schema';

import getColorMessage from './getColorMessage';
import paletteMessages from './paletteMessages';
import { type PaletteColor } from './type';

const cellBackgroundColorPalette: Array<PaletteColor> = [];

tableBackgroundColorPalette.forEach((label, color) => {
	// eslint-disable-next-line @atlassian/perf-linting/no-expensive-split-replace -- Ignored via go/ees017 (to be fixed)
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
