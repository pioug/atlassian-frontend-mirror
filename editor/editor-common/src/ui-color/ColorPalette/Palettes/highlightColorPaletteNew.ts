import { backgroundColorPaletteNew } from '@atlaskit/adf-schema';

import { REMOVE_HIGHLIGHT_COLOR, highlightColorPalette } from './highlightColorPalette';
import { mapPaletteColor } from './mapPaletteColor';
import type { PaletteColor } from './type';

const removeHighlightColor = highlightColorPalette.find(
	({ value }) => value === REMOVE_HIGHLIGHT_COLOR,
);

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const highlightColorPaletteNew: Array<PaletteColor> = removeHighlightColor
	? [removeHighlightColor]
	: [];

backgroundColorPaletteNew.forEach((label, color) => {
	highlightColorPaletteNew.push(mapPaletteColor(label, color));
});
