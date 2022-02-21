import { ElementProps } from '../types';
import { MessageProps } from '../../types';

export type TextProps = ElementProps & {
  content?: string;
  maxLines?: number;
  message?: MessageProps;
};
