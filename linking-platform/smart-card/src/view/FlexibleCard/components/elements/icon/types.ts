import { type ElementProps } from '../types';
import { type IconType, type SmartLinkPosition } from '../../../../../constants';

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
   * If provided, overrideIcon will be rendered in the place of the provided icon or one that is 
   * supplied by the URL.
   */
  overrideIcon?: React.ReactNode;

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
