import { WithAnalyticsEventsProps } from '@atlaskit/analytics-next';

export type CardAppearance = 'inline' | 'block';

export interface CardProps extends WithAnalyticsEventsProps {
  appearance: CardAppearance;
  isSelected?: boolean;
  onClick?: React.EventHandler<React.MouseEvent | React.KeyboardEvent>;
  importer?: (target: any) => void;
  container?: HTMLElement;
  data?: any;
  url?: string;
  testId?: string;
  onResolve?: (data: { url?: string; title?: string }) => void;
}
