import { ActionItem, BlockProps, ElementItem } from '../types';
import { OnActionMenuOpenChangeOptions } from '../types';

export type AIState = 'ready' | 'loading' | 'error' | 'done';

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
   * Function to be called when AI Summary state changed.
   */
  onAIActionChange?: (state: AIState) => void;
} & BlockProps;
