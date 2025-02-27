import { type ModalDialogProps, type WidthNames } from '../types';

interface Width {
	values: string[];
	widths: { [index in WidthNames]: number };
	defaultValue: string;
}

export const width: Width = {
	values: ['small', 'medium', 'large', 'x-large'],
	widths: {
		small: 400,
		medium: 600,
		large: 800,
		'x-large': 968,
	},
	defaultValue: 'medium',
};

export const dialogWidth = (input?: ModalDialogProps['width']) => {
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

export const dialogHeight = (input?: ModalDialogProps['height']) => {
	if (!input) {
		return 'auto';
	}

	return typeof input === 'number' ? `${input}px` : input;
};
