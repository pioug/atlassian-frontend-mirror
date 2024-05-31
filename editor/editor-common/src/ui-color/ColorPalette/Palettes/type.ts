import { type MessageDescriptor } from 'react-intl-next';

export interface PaletteColor {
	value: string;
	label: string;
	border: string;
	message?: MessageDescriptor;
}

export type Palette = Array<PaletteColor>;

export type PaletteTooltipMessages = {
	dark: Record<string, MessageDescriptor>;
	light: Record<string, MessageDescriptor>;
};
