import { ElementProps } from '../types';
import { MediaType } from '../../../../../constants';

export type MediaProps = ElementProps & {
  type?: MediaType;
  url?: string;
};
