import { ElementProps } from '../types';

export type DateTimeType = 'created' | 'modified';

export type DateTimeProps = ElementProps & {
  type?: DateTimeType;
  date?: Date;
};
