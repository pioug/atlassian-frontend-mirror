import { ElementProps } from '../types';
import { SmartLinkTheme } from '../../../../../constants';
import { AnchorTarget } from '../../types';

export type LinkProps = ElementProps & {
  /**
   * Determines whether the link should display tooltip on hover.
   */
  hideTooltip?: boolean;

  /**
   * Determines the behaviour when the Link is clicked. By default is used to
   * propagate analytics.
   */
  onClick?: React.EventHandler<React.MouseEvent | React.KeyboardEvent>;

  /**
   * Mouse event to be provided to the link
   */
  onMouseDown?: React.MouseEventHandler;

  /**
   * The number of lines that the link text should spread over. Maximum of 2 lines.
   */
  maxLines?: number;

  /**
   * The text to display. Overrides the default link text.
   */
  text?: string;

  /**
   * The theme of the link. Can be Black, or Link (default blue URL).
   */
  theme?: SmartLinkTheme;
  /**
   * The url that the Smart Link should be based upon.
   */
  url?: string;

  /**
   * The href target behaviour of the link.
   */
  target?: AnchorTarget;
};
