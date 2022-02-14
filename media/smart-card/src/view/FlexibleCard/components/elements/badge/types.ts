import { ElementProps } from '../types';
import { IconType } from '../../../../../constants';

export type BadgeProps = ElementProps & {
  icon?: IconType;
  url?: string;
  label?: string;
};
