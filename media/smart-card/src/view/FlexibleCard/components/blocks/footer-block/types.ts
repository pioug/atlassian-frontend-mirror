import { ActionItem, BlockProps } from '../types';

export type FooterBlockProps = BlockProps & {
  actions?: ActionItem[];
};
