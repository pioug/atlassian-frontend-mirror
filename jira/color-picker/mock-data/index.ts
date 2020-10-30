// AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { colors } from '@atlaskit/theme';

export const simplePalette = [
  {
    label: 'Purple',
    value: colors.P200,
  },
  {
    label: 'Blue',
    value: colors.B200,
  },
  {
    label: 'Green',
    value: colors.G200,
  },
  {
    label: 'Teal',
    value: colors.T200,
  },
  {
    label: 'Yellow',
    value: colors.Y200,
  },
  {
    label: 'Red',
    value: colors.R200,
  },
];

export const extendedPalette = simplePalette.concat([
  {
    label: 'Dark Purple',
    value: colors.P400,
  },
  {
    label: 'Dark Blue',
    value: colors.B400,
  },
  {
    label: 'Dark Green',
    value: colors.G400,
  },
  {
    label: 'Dark Teal',
    value: colors.T400,
  },
  {
    label: 'Dark Yellow',
    value: colors.Y400,
  },
  {
    label: 'Dark Red',
    value: colors.R400,
  },
]);
