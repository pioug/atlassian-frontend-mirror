import { colorPalette } from '@atlaskit/adf-schema';

import { mapPaletteColor } from './mapPaletteColor';
import type { PaletteColor } from './type';

// row 1
export const textColorPalette: Array<PaletteColor> = [];

colorPalette.forEach((label, color) => {
	textColorPalette.push(mapPaletteColor(label, color));
});
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { mapPaletteColor } from './mapPaletteColor';
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { textColorPaletteTokenBorders } from './textColorPaletteTokenBorders';
