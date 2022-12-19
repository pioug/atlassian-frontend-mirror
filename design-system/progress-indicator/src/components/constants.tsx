import type { UNSAFE_InlineProps } from '@atlaskit/ds-explorations';
import { token } from '@atlaskit/tokens';

type TokenValue = ReturnType<typeof token>;
type ScaleValue = UNSAFE_InlineProps['gap'];
type SpacingTuple = [ScaleValue, TokenValue];
type SpacingPropsToTokensMap = {
  comfortable: {
    small: SpacingTuple;
    default: SpacingTuple;
    large: SpacingTuple;
  };
  cozy: {
    small: SpacingTuple;
    default: SpacingTuple;
    large: SpacingTuple;
  };
  compact: {
    small: SpacingTuple;
    default: SpacingTuple;
    large: SpacingTuple;
  };
};

export const progressIndicatorGapMap: SpacingPropsToTokensMap = {
  comfortable: {
    small: ['scale.075', token('space.075', '6px')],
    default: ['scale.100', token('space.100', '8px')],
    large: ['scale.150', token('space.150', '12px')],
  },
  cozy: {
    small: ['scale.050', token('space.050', '4px')],
    default: ['scale.075', token('space.075', '6px')],
    large: ['scale.100', token('space.100', '8px')],
  },
  compact: {
    small: ['scale.025', token('space.025', '2px')],
    default: ['scale.050', token('space.050', '4px')],
    large: ['scale.075', token('space.075', '6px')],
  },
};

export const sizes = {
  small: 4,
  default: 8,
  large: 12,
};

export const varDotsSize = '--ds-dots-size';
export const varDotsMargin = '--ds-dots-margin';
