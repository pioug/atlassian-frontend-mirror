import { ElementProps } from '../types';

export type DateTimeType = 'created' | 'modified';

export type DateTimeProps = ElementProps & {
  /**
   * Whether the date time element text should contain "Modified" or "Created"
   */
  type?: DateTimeType;

  /**
   * The date to display in the element.
   */
  date?: Date;
};
