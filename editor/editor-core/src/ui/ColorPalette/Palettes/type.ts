import { MessageDescriptor } from 'react-intl-next';

export interface PaletteColor {
  value: string;
  label: string;
  border: string;
  message?: MessageDescriptor;
}

export type Palette = Array<PaletteColor>;
