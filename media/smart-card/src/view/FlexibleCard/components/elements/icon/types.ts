import { ElementProps } from '../types';
import { IconType, SmartLinkPosition } from '../../../../../constants';

export type IconProps = ElementProps & {
  icon?: IconType;
  label?: string;
  position?: SmartLinkPosition;
  render?: () => React.ReactNode;
  url?: string;
};
