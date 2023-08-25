import { ElementProps } from '../types';

export type DateTimeType = 'created' | 'modified' | 'sent';

export type DateTimeProps = ElementProps & {
  /**
   * Whether the date time element text should contain "Modified" or "Created" or "sent"
   */
  type?: DateTimeType;

  /**
   * The date to display in the element.
   */
  date?: Date;

  /**
   * The override text which will show next to the date
   */
  text?: string;
};
