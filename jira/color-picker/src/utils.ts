import { COLOR_CARD_SIZE } from './constants';
import memoizeOne from 'memoize-one';
import { Mode, type Palette } from './types';

export const getWidth = (cols: number, mode?: Mode) => {
	const width = cols * (COLOR_CARD_SIZE + 4);

	return mode === Mode.Standard ? width + 8 : width;
};

export const getOptions = memoizeOne(
	(palette: Palette, selectedColor?: string, showDefaultSwatchColor?: boolean) => {
		let focusedItemIndex = 0;
		let defaultSelectedColor = palette[0];
		if (!showDefaultSwatchColor) {
			defaultSelectedColor = { label: '', value: '' };
		}
		const value =
			palette.find((color, index) => {
				if (color.value === selectedColor) {
					focusedItemIndex = index;
					return true;
				}

				return false;
			}) || defaultSelectedColor;

		return {
			options: palette,
			value,
			focusedItemIndex,
		};
	},
);
