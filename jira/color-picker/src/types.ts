import type { COLOR_PALETTE_MENU, COLOR_PICKER } from './constants';

export type ColorCardType = typeof COLOR_PICKER | typeof COLOR_PALETTE_MENU;

export interface Color {
	label: string;
	value: string;
}

export type Palette = Color[];

export enum Mode {
	Compact,
	Standard,
}

export type SwatchSize = 'small' | 'default';
