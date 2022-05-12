import { ElementProps } from '../types';
import { IconType } from '../../../../../constants';

export type BadgeProps = ElementProps & {
  /**
   * The Atlaskit Icon to display next to the label. If this is not supplied,
   * then the badge icon will fallback to the URL provided.
   */
  icon?: IconType;

  /**
   * The icon from this URL will be used for the badge if no Atlaskit Icon is provided.
   */
  url?: string;

  /**
   * The text to display for the badge
   */
  label?: string;
};
