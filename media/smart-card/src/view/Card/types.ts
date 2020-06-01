import { WithAnalyticsEventsProps } from '@atlaskit/analytics-next';

export type CardAppearance = 'inline' | 'block' | 'embed';
export type CardInnerAppearance = CardAppearance | 'preview';

export interface CardProps extends WithAnalyticsEventsProps {
  appearance: CardAppearance;
  isSelected?: boolean;
  isFrameVisible?: boolean;
  onClick?: React.EventHandler<React.MouseEvent | React.KeyboardEvent>;
  importer?: (target: any) => void;
  container?: HTMLElement;
  data?: any;
  url?: string;
  testId?: string;
  showActions?: boolean;
  onResolve?: (data: { url?: string; title?: string }) => void;
}
