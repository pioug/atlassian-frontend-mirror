import { FormattedMessage } from 'react-intl';

export interface PaletteColor {
  value: string;
  label: string;
  border: string;
  message?: FormattedMessage.MessageDescriptor;
}

export type Palette = Array<PaletteColor>;
