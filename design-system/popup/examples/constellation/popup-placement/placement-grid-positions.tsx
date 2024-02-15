/* eslint-disable @repo/internal/styles/no-exported-styles */
import { Placement } from '@atlaskit/popper';
import { xcss, XCSS } from '@atlaskit/primitives';

export const placementGridPositions: {
  [placement in Placement]: XCSS;
} = {
  'top-start': xcss({
    gridColumn: 2,
    gridRow: 1,
  }),
  top: xcss({
    gridColumn: 3,
    gridRow: 1,
  }),
  'top-end': xcss({
    gridColumn: 4,
    gridRow: 1,
  }),
  'bottom-start': xcss({
    gridColumn: 2,
    gridRow: 5,
  }),
  bottom: xcss({
    gridColumn: 3,
    gridRow: 5,
  }),
  'bottom-end': xcss({
    gridColumn: 4,
    gridRow: 5,
  }),
  'right-start': xcss({
    gridColumn: 5,
    gridRow: 2,
  }),
  right: xcss({
    gridColumn: 5,
    gridRow: 3,
  }),
  'right-end': xcss({
    gridColumn: 5,
    gridRow: 4,
  }),
  'left-start': xcss({
    gridColumn: 1,
    gridRow: 2,
  }),
  left: xcss({
    gridColumn: 1,
    gridRow: 3,
  }),
  'left-end': xcss({
    gridColumn: 1,
    gridRow: 4,
  }),
  'auto-start': xcss({
    gridColumn: 3,
    gridRow: 2,
  }),
  auto: xcss({
    gridColumn: 3,
    gridRow: 3,
  }),
  'auto-end': xcss({
    gridColumn: 3,
    gridRow: 4,
  }),
};
