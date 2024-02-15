// AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { gridSize } from '@atlaskit/theme';
import { COLOR_CARD_SIZE } from './constants';
import memoizeOne from 'memoize-one';
import { Mode, Palette } from './types';

export const getWidth = (cols: number, mode?: Mode) => {
  const width = cols * (COLOR_CARD_SIZE + gridSize() / 2);

  return mode === Mode.Standard ? width + gridSize() : width;
};

export const getOptions = memoizeOne(
  (palette: Palette, selectedColor?: string) => {
    let focusedItemIndex = 0;
    const value =
      palette.find((color, index) => {
        if (color.value === selectedColor) {
          focusedItemIndex = index;
          return true;
        }

        return false;
      }) || palette[0];

    return {
      options: palette,
      value,
      focusedItemIndex,
    };
  },
);
