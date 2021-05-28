// eslint-disable-next-line @repo/internal/fs/filename-pattern-match
import { gridSize } from '@atlaskit/theme/constants';

import { AvatarSizeMap, IndicatorSizeType } from './types';

export const AVATAR_SIZES: AvatarSizeMap = {
  xsmall: gridSize() * 2,
  small: gridSize() * 3,
  medium: gridSize() * 4,
  large: gridSize() * 5,
  xlarge: gridSize() * 12,
  xxlarge: gridSize() * 16,
};

// border radius only applies to "square" avatars
export const AVATAR_RADIUS: AvatarSizeMap = {
  xsmall: 2,
  small: 2,
  medium: 3,
  large: 3,
  xlarge: 6,
  xxlarge: 12,
};

export const BORDER_WIDTH = 2;
export const ACTIVE_SCALE_FACTOR = 0.9;

export const ICON_SIZES: Record<IndicatorSizeType, number> = {
  small: 12,
  medium: 14,
  large: 15,
  xlarge: 18,
};

export const ICON_OFFSET: Record<IndicatorSizeType, number> = {
  small: 0,
  medium: 0,
  large: 1,
  xlarge: 7,
};
