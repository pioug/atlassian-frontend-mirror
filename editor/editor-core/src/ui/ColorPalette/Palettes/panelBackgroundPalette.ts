// AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { colors } from '@atlaskit/theme';

import { PaletteColor } from './type';
import { DEFAULT_BORDER_COLOR } from './common';

export const panelBackgroundPalette: PaletteColor[] = [
  { label: 'Doctor', value: colors.N0 },
  { label: 'Pixie dust', value: colors.B50 },
  { label: "Gram's sofa", value: colors.T50 },
  { label: 'The smell', value: colors.G50 },
  { label: 'James blonde', value: colors.Y50 },
  { label: 'Rosie', value: colors.R50 },
  { label: 'Lavender secret', value: colors.P50 },

  { label: "Gram's hair", value: colors.N20 },
  { label: 'Schwag', value: colors.B75 },
  { label: 'Arctic chill', value: colors.T75 },
  { label: 'Mintie', value: colors.G75 },
  { label: 'Dandelion whisper', value: colors.Y75 },
  { label: 'Bondi sunburn', value: colors.R75 },
  { label: 'Phantom mist', value: colors.P75 },

  { label: 'Sentinel', value: colors.N60 },
  { label: 'Arvo breeze', value: colors.B100 },
  { label: 'Hairy fairy', value: colors.T100 },
  { label: 'Green tea', value: colors.G200 },
  { label: 'Pub mix', value: colors.Y200 },
  { label: 'Alexandria', value: colors.R100 },
  { label: 'Herky jerky', value: colors.P100 },
].map((color) => ({
  ...color,
  border: DEFAULT_BORDER_COLOR,
}));
