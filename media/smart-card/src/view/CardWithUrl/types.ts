import { EventHandler, MouseEvent, KeyboardEvent } from 'react';
import { CardAppearance } from '../Card/types';
import { AnalyticsHandler } from '../../utils/types';

export type CardWithUrlContentProps = {
  url: string;
  appearance: CardAppearance;
  onClick?: EventHandler<MouseEvent | KeyboardEvent>;
  isSelected?: boolean;
  container?: HTMLElement;
  dispatchAnalytics: AnalyticsHandler;
  testId?: string;
  onResolve?: (data: { url?: string; title?: string }) => void;
  showActions?: boolean;
};
