import {
  SmartLinkSize,
  SmartLinkStatus,
  SmartLinkTheme,
} from '../../../../constants';
import { RetryOptions } from '../../types';

export type ContainerProps = {
  hideBackground?: boolean;
  hideElevation?: boolean;
  hidePadding?: boolean;
  retry?: RetryOptions;
  size?: SmartLinkSize;
  status?: SmartLinkStatus;
  testId?: string;
  theme?: SmartLinkTheme;
  onClick?: React.EventHandler<React.MouseEvent | React.KeyboardEvent>;
};
