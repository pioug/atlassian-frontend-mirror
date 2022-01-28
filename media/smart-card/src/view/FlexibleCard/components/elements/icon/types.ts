import { ElementProps } from '../types';
import { IconType } from '../../../../../constants';

export type IconProps = ElementProps & {
  icon?: IconType;
  label?: string;
  url?: string;
};
