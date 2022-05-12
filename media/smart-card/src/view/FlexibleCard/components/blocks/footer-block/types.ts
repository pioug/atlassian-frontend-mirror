import { ActionItem, BlockProps } from '../types';

export type FooterBlockProps = {
  /**
   * An array of actions to be displayed on the right.
   * Adding more than three actions will result in the second and following
   * actions being hidden inside of a dropdown
   * @see ActionItem
   */
  actions?: ActionItem[];
} & BlockProps;
