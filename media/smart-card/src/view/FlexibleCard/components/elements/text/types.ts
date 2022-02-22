import { ElementProps } from '../types';
import { MessageProps } from '../../types';

export type TextProps = ElementProps & {
  color?: string;
  content?: string;
  maxLines?: number;
  message?: MessageProps;
};
