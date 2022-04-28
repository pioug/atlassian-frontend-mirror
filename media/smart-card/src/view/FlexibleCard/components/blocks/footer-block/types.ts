import { ActionItem, BlockProps } from '../types';

export type FooterBlockProps = BlockProps & {
  /* An array of actions to display. */
  actions?: ActionItem[];
};
