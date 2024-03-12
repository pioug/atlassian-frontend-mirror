import { ActionItem, BlockProps, ElementItem } from '../types';
import { OnActionMenuOpenChangeOptions } from '../types';

export type AISummaryBlockProps = {
  /**
   * An array of actions to be displayed on the right
   * after AI Summary button.
   * @see ActionItem
   */
  actions?: ActionItem[];

  /**
   * An array of metadata elements to display on the left.
   * @see ElementItem
   */
  metadata?: ElementItem[];

  /**
   * Function to be called when footer action dropdown open state is changed.
   */
  onActionMenuOpenChange?: (options: OnActionMenuOpenChangeOptions) => void;

  /**
   * Minimum height requirement for the AISummary component to prevent fluctuations in a card size on the summary action.
   */
  aiSummaryMinHeight?: number;
} & BlockProps;
