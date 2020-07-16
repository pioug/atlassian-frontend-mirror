import { UIAnalyticsEvent } from '@atlaskit/analytics-next';

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

export type AvatarClickEventHandler = (
  event: React.MouseEvent,
  analyticsEvent?: UIAnalyticsEvent,
) => void;
