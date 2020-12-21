import { EventHandler, MouseEvent, KeyboardEvent } from 'react';
import { CardAppearance, CardPlatform } from '../Card/types';
import { AnalyticsHandler } from '../../utils/types';

export type CardWithUrlContentProps = {
  id: string;
  url: string;
  appearance: CardAppearance;
  platform?: CardPlatform;
  onClick?: EventHandler<MouseEvent | KeyboardEvent>;
  isSelected?: boolean;
  isFrameVisible?: boolean;
  container?: HTMLElement;
  dispatchAnalytics: AnalyticsHandler;
  testId?: string;
  onResolve?: (data: { url?: string; title?: string }) => void;
  showActions?: boolean;
  inheritDimensions?: boolean;
  embedIframeRef?: React.Ref<HTMLIFrameElement>;
};
