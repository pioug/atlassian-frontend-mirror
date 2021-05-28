import { UIAnalyticsEvent } from '@atlaskit/analytics-next';

export type AvatarSizeMap = Record<SizeType, number>;
// eslint-disable-next-line @repo/internal/react/consistent-types-definitions
export type AppearanceType = 'circle' | 'square';

// eslint-disable-next-line @repo/internal/react/consistent-types-definitions
export type SizeType =
  | 'xsmall'
  | 'small'
  | 'medium'
  | 'large'
  | 'xlarge'
  | 'xxlarge';

// eslint-disable-next-line @repo/internal/react/consistent-types-definitions
export type IndicatorSizeType = 'small' | 'medium' | 'large' | 'xlarge';

export type AvatarClickEventHandler = (
  event: React.MouseEvent,
  analyticsEvent?: UIAnalyticsEvent,
) => void;
