import type { WidthNames } from '../types';

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
} as const;
