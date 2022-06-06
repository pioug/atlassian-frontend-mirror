import { WithAnalyticsEventsProps } from '@atlaskit/analytics-next';
import { CardAppearance, CardPlatform } from '@atlaskit/linking-common';
import { AnalyticsFacade } from '../../state/analytics';
import { FlexibleUiOptions } from '../FlexibleCard/types';
import { InlinePreloaderStyle } from '../types';

export type { CardAppearance, CardPlatform };
export type CardInnerAppearance = CardAppearance | 'preview' | 'flexible';

export type OnResolveCallback = (data: {
  url?: string;
  title?: string;
  aspectRatio?: number;
}) => void;

export interface CardProps extends WithAnalyticsEventsProps {
  appearance: CardAppearance;
  id?: string;
  platform?: CardPlatform;
  isSelected?: boolean;
  isFrameVisible?: boolean;
  onClick?: React.EventHandler<React.MouseEvent | React.KeyboardEvent>;
  importer?: (target: any) => void;
  container?: HTMLElement;
  data?: any;
  url?: string;
  testId?: string;
  showActions?: boolean;
  onResolve?: OnResolveCallback;
  inheritDimensions?: boolean;
  embedIframeRef?: React.Ref<HTMLIFrameElement>;
  inlinePreloaderStyle?: InlinePreloaderStyle;
  ui?: FlexibleUiOptions;
  children?: React.ReactNode;
  showHoverPreview?: boolean;
  analyticsEvents?: AnalyticsFacade;
}
