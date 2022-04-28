import { ElementProps } from '../types';
import { IconType, SmartLinkPosition } from '../../../../../constants';

export type IconProps = ElementProps & {
  /* If provided, Icon element will use this render function instead. */
  render?: () => React.ReactNode;
  /* The Atlaskit Icon to display. If no icon is provided, then the URL provided will be used. */
  icon?: IconType;
  /* The label provided to the Atlaskit Icon. */
  label?: string;
  /** Determines how the icon should be rendered.
   * Top: Icon will be rendered at the "top" of the smart link.
   * Center: Icon will be rendered at the "center" of the smart link relative to the vertical height.
   */
  position?: SmartLinkPosition;
  /* The icon from this url will be used if no render function or Atlaskit Icon is provided.*/
  url?: string;
};
