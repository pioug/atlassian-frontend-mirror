import type { ModalDialogProps, WidthNames } from '../../types';
import { width } from '../width';

export const dialogWidth = (input?: ModalDialogProps['width']): string => {
	if (!input) {
		return 'auto';
	}

	const isWidthName = width.values.indexOf(input.toString()) !== -1;
	const widthName = isWidthName && (input as WidthNames);

	if (widthName) {
		return `${width.widths[widthName]}px`;
	}

	return typeof input === 'number' ? `${input}px` : input;
};
