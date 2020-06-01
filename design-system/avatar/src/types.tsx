import { AnalyticsEvent } from '@atlaskit/analytics-next';

export type AvatarSizeMap = Record<SizeType, number>;
export type AppearanceType = 'circle' | 'square';

export type SizeType =
  | 'xsmall'
  | 'small'
  | 'medium'
  | 'large'
  | 'xlarge'
  | 'xxlarge';

export type IndicatorSizeType = 'small' | 'medium' | 'large' | 'xlarge';

export type AvatarClickType = (
  event: React.MouseEvent,
  analyticsEvent?: AnalyticsEvent,
) => void;
