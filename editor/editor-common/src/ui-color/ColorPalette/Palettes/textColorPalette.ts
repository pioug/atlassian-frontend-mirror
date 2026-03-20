import type { MessageDescriptor } from 'react-intl-next';

import { colorPalette } from '@atlaskit/adf-schema';
import { token } from '@atlaskit/tokens';

import getColorMessage from './getColorMessage';
import paletteMessages from './paletteMessages';
import type { PaletteColor } from './type';

export const mapPaletteColor = (
	label: string,
	color: string,
): {
	border: 'var(--ds-border)';
	label: string;
	message: MessageDescriptor | undefined;
	value: string;
} => {
	const key = label.toLowerCase().replace(' ', '-');
	const message = getColorMessage(paletteMessages, key);
	return {
		value: color,
		label,
		border: token('color.border', '#091E4224'),
		message,
	};
};

// row 1
export const textColorPalette: Array<PaletteColor> = [];

export const textColorPaletteTokenBorders: Array<PaletteColor> = [];

colorPalette.forEach((label, color) => {
	textColorPalette.push(mapPaletteColor(label, color));
});
