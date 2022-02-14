import { ElementProps } from '../types';
import { SmartLinkTheme } from '../../../../../constants';

export type LinkProps = ElementProps & {
  maxLines?: number;
  text?: string;
  theme?: SmartLinkTheme;
  url?: string;
};
