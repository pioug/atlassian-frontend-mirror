/* eslint-disable @repo/internal/styles/no-exported-styles */
import { css, SerializedStyles } from '@emotion/react';

import { Placement } from '@atlaskit/popper';

export const placementGridPositions: {
  [placement in Placement]: SerializedStyles;
} = {
  'top-start': css({
    gridColumn: 2,
    gridRow: 1,
  }),
  top: css({
    gridColumn: 3,
    gridRow: 1,
  }),
  'top-end': css({
    gridColumn: 4,
    gridRow: 1,
  }),
  'bottom-start': css({
    gridColumn: 2,
    gridRow: 5,
  }),
  bottom: css({
    gridColumn: 3,
    gridRow: 5,
  }),
  'bottom-end': css({
    gridColumn: 4,
    gridRow: 5,
  }),
  'right-start': css({
    gridColumn: 5,
    gridRow: 2,
  }),
  right: css({
    gridColumn: 5,
    gridRow: 3,
  }),
  'right-end': css({
    gridColumn: 5,
    gridRow: 4,
  }),
  'left-start': css({
    gridColumn: 1,
    gridRow: 2,
  }),
  left: css({
    gridColumn: 1,
    gridRow: 3,
  }),
  'left-end': css({
    gridColumn: 1,
    gridRow: 4,
  }),
  'auto-start': css({
    gridColumn: 3,
    gridRow: 2,
  }),
  auto: css({
    gridColumn: 3,
    gridRow: 3,
  }),
  'auto-end': css({
    gridColumn: 3,
    gridRow: 4,
  }),
};
