import { BlockProps, ElementItem, ActionItem } from '../types';
import { SmartLinkPosition, SmartLinkTheme } from '../../../../../constants';
import { RetryOptions } from '../../../types';
import { LinkProps } from '../../elements/link/types';

export type TitleBlockProps = BlockProps & {
  maxLines?: number;
  metadata?: ElementItem[];
  position?: SmartLinkPosition;
  retry?: RetryOptions;
  subtitle?: ElementItem[];
  actions?: ActionItem[];
  theme?: SmartLinkTheme;
  text?: string;
  showActionOnHover?: boolean;
  onClick?: React.EventHandler<React.MouseEvent | React.KeyboardEvent>;
  anchorTarget?: LinkProps['target'];
};
