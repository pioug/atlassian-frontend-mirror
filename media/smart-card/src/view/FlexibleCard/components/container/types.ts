import {
  SmartLinkSize,
  SmartLinkStatus,
  SmartLinkTheme,
} from '../../../../constants';
import { RetryOptions } from '../../types';

export type ContainerProps = {
  /* Determines whether to hide elevation styling. */
  hideElevation?: boolean;
  /* Determines whether to hide css padding styling. */
  hidePadding?: boolean;
  /* Determines whether to hide css background color styling. */
  hideBackground?: boolean;
  /* The options that determine the retry behaviour when a Smart Link errors. */
  retry?: RetryOptions;
  /* Determines the default padding and sizing of the underlying blocks and elements within Flexible UI. */
  size?: SmartLinkSize;
  /* The status of the Smart Link. Used to conditionally render different blocks when Smart Link is in different states.*/
  status?: SmartLinkStatus;
  /* Determines the default theme of the Flexible UI. */
  theme?: SmartLinkTheme;
  /* Determines the onClick behaviour of Flexible UI. This will proxy to the TitleBlock if supplied. */
  onClick?: React.EventHandler<React.MouseEvent | React.KeyboardEvent>;
  testId?: string;
};
