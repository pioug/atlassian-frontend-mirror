import { type ReactElement } from 'react';

import { type MessageDescriptor } from 'react-intl-next';

export interface PaletteColor {
	border: string;
	decorator?: ReactElement;
	label: string;
	message?: MessageDescriptor;
	value: string;
}

export type Palette = Array<PaletteColor>;

export type PaletteTooltipMessages = {
	dark: Record<string, MessageDescriptor>;
	light: Record<string, MessageDescriptor>;
};
