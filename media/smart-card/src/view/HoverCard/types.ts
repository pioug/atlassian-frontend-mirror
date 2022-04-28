import { WithAnalyticsEventsProps } from '@atlaskit/analytics-next';
export interface HoverCardProps extends WithAnalyticsEventsProps {
  url: string;
}

export type PreviewDisplay = 'card' | 'embed';
export type PreviewInvokeMethod = 'keyboard' | 'mouse_hover' | 'mouse_click';
