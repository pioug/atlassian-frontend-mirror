import { ElementProps } from '../types';
import { IconType, SmartLinkPosition } from '../../../../../constants';

export type IconProps = ElementProps & {
  /**
   * If provided, Icon element will use this render function instead.
   */
  render?: () => React.ReactNode;

  /**
   * The Atlaskit Icon to display. If no icon is provided, then the URL provided
   * will be used.
   */
  icon?: IconType;

  /**
   * The label provided to the Atlaskit Icon.
   */
  label?: string;

  /**
   * Determines the position of the link icon in relative to the vertical
   * height.  It can either be centred or placed on “top”. Default is top.
   */
  position?: SmartLinkPosition;

  /**
   * The icon from this url will be used if no render function or Atlaskit Icon is provided.
   */
  url?: string;
};
