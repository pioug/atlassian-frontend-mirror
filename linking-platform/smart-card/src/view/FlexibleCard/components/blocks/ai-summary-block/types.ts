import { type ReactNode } from 'react';
import { type ActionItem, type BlockProps, type ElementItem } from '../types';
import { type OnActionMenuOpenChangeOptions } from '../types';

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

  /**
   * Placeholder to show when summary is not available
   */
  placeholder?: ReactNode;
} & BlockProps;
