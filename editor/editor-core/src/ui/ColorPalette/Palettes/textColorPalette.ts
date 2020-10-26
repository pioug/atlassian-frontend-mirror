import { colorPalette, colorPaletteExperimental } from '@atlaskit/adf-schema';
import { PaletteColor } from './type';
import getColorMessage from './getColorMessage';
import paletteMessages from './paletteMessages';
import { DEFAULT_BORDER_COLOR } from './common';

const mapPaletteColor = (label: string, color: string) => {
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
export const textColorPaletteExperimental: Array<PaletteColor> = [];

colorPalette.forEach((label, color) => {
  textColorPalette.push(mapPaletteColor(label, color));
});
colorPaletteExperimental.forEach((label, color) => {
  textColorPaletteExperimental.push(mapPaletteColor(label, color));
});
