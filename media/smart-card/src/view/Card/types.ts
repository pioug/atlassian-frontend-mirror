import { WithAnalyticsEventsProps } from '@atlaskit/analytics-next';
import { JsonLd } from 'json-ld-types';
import { InlinePreloaderStyle } from '@atlaskit/media-ui/types';

export type CardAppearance = 'inline' | 'block' | 'embed';
export type CardInnerAppearance = CardAppearance | 'preview';
export type CardPlatform = JsonLd.Primitives.Platforms;

export type OnResolveCallback = (data: {
  url?: string;
  title?: string;
  aspectRatio?: number;
}) => void;

export interface CardProps extends WithAnalyticsEventsProps {
  appearance: CardAppearance;
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
}
