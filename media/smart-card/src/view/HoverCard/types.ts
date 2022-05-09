import { WithAnalyticsEventsProps } from '@atlaskit/analytics-next';
import { ElementItem } from '../FlexibleCard/components/blocks/types';
export interface HoverCardProps extends WithAnalyticsEventsProps {
  url: string;
}

export type PreviewDisplay = 'card' | 'embed';
export type PreviewInvokeMethod = 'keyboard' | 'mouse_hover' | 'mouse_click';

export interface MetadataOptions {
  primary: Array<ElementItem>;
  secondary: Array<ElementItem>;
}
