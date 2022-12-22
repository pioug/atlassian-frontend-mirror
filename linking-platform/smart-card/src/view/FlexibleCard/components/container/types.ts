import { SmartLinkStatus } from '../../../../constants';
import { FlexibleUiOptions, RetryOptions } from '../../types';

export type ContainerProps = FlexibleUiOptions & {
  /**
   * Determines the onClick behaviour of Flexible UI. This will proxy to the
   * TitleBlock if supplied.
   */
  onClick?: React.EventHandler<React.MouseEvent | React.KeyboardEvent>;

  /**
   * The options that determine the retry behaviour when a Smart Link errors.
   */
  retry?: RetryOptions;

  /**
   * The status of the Smart Link. Used to conditionally render different blocks
   * when Smart Link is in different states.
   */
  status?: SmartLinkStatus;

  /**
   * A `testId` prop is provided for specified elements, which is a unique
   * string that appears as a data attribute `data-testid` in the rendered code,
   * serving as a hook for automated tests
   */
  testId?: string;

  /**
   * Determine whether or not a preview card should show up when a user hovers
   * over the smartlink.
   */
  showHoverPreview?: Boolean;
};

export type ChildrenOptions = {
  previewOnLeft?: boolean;
  previewOnRight?: boolean;
};
