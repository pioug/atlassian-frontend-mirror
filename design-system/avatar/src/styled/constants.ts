import { SizeType, IndicatorSizeType } from '../types';
import { gridSize } from '@atlaskit/theme/constants';

type AvatarSizeMap = Record<SizeType, number>;
type IconSizeMap = Record<IndicatorSizeType, number>;

export const TRANSITION_DURATION = '200ms';

const gridSizeValue: number = gridSize();

export const AVATAR_SIZES: AvatarSizeMap = {
  xsmall: gridSizeValue * 2,
  small: gridSizeValue * 3,
  medium: gridSizeValue * 4,
  large: gridSizeValue * 5,
  xlarge: gridSizeValue * 12,
  xxlarge: gridSizeValue * 16,
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

export const BORDER_WIDTH: AvatarSizeMap = {
  xsmall: 2,
  small: 2,
  medium: 2,
  large: 2,
  xlarge: 2,
  xxlarge: 2,
};

// NOTE: sizes xsmall & xxlarge DO NOT support
// - groups
// - presence
// - status
export const EXCESS_INDICATOR_FONT_SIZE: IconSizeMap = {
  small: 10,
  medium: 11,
  large: 12,
  xlarge: 16,
};

export const ICON_SIZES: IconSizeMap = {
  small: 12,
  medium: 14,
  large: 15,
  xlarge: 18,
};

export const ICON_OFFSET: IconSizeMap = {
  small: 0,
  medium: 0,
  large: 1,
  xlarge: 7,
};

export const SQUARE_ICON_OFFSET: IconSizeMap = {
  small: 0,
  medium: 0,
  large: 0,
  xlarge: 1,
};
