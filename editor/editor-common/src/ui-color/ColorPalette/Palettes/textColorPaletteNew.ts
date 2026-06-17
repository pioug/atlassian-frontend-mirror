import { colorPaletteNew } from '@atlaskit/adf-schema';

import { mapPaletteColor } from './mapPaletteColor';
import type { PaletteColor } from './type';

// new color palette behind platform_editor_lovability_text_bg_color
export const textColorPaletteNew: Array<PaletteColor> = [];
colorPaletteNew.forEach((label, color) => {
	textColorPaletteNew.push(mapPaletteColor(label, color));
});
