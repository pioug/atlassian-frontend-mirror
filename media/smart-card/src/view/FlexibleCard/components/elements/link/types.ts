import { ElementProps } from '../types';
import { SmartLinkTheme } from '../../../../../constants';

export type LinkProps = ElementProps & {
  onClick?: React.EventHandler<React.MouseEvent | React.KeyboardEvent>;
  maxLines?: number;
  text?: string;
  theme?: SmartLinkTheme;
  url?: string;
};
