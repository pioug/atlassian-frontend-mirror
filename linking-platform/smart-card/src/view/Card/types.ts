import { WithAnalyticsEventsProps } from '@atlaskit/analytics-next';
import { CardAppearance, CardPlatform } from '@atlaskit/linking-common';
import { AnalyticsFacade } from '../../state/analytics';
import { FlexibleUiOptions } from '../FlexibleCard/types';
import { InlinePreloaderStyle, OnErrorCallback } from '../types';

export type { CardAppearance, CardPlatform };
export type CardInnerAppearance =
  | CardAppearance
  | 'embedPreview'
  | 'flexible'
  | 'hoverCardPreview';

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
  onError?: OnErrorCallback;
  inheritDimensions?: boolean;
  embedIframeRef?: React.Ref<HTMLIFrameElement>;
  inlinePreloaderStyle?: InlinePreloaderStyle;
  ui?: FlexibleUiOptions;
  children?: React.ReactNode;
  showHoverPreview?: boolean;
  showAuthTooltip?: boolean;
  analyticsEvents?: AnalyticsFacade;
  placeholder?: string;
}
