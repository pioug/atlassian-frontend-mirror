// AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { colors } from '@atlaskit/theme';

import { darkPanelColors } from '../../../panel';

import { DEFAULT_BORDER_COLOR } from './common';
import { PaletteColor } from './type';

/** this is not new usage - old code extracted from editor-core */
/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
export const panelBackgroundPalette: PaletteColor[] = [
  { label: 'White', value: colors.N0 },
  { label: 'Light blue', value: colors.B50 },
  { label: 'Light teal', value: colors.T50 },
  { label: 'Light green', value: colors.G50 },
  { label: 'Light yellow', value: colors.Y50 },
  { label: 'Light red', value: colors.R50 },
  { label: 'Light purple', value: colors.P50 },

  { label: 'Light gray', value: colors.N20 },
  { label: 'Blue', value: colors.B75 },
  { label: 'Teal', value: colors.T75 },
  { label: 'Green', value: colors.G75 },
  { label: 'Yellow', value: colors.Y75 },
  { label: 'Red', value: colors.R75 },
  { label: 'Purple', value: colors.P75 },

  { label: 'Gray', value: colors.N60 },
  { label: 'Dark blue', value: colors.B100 },
  { label: 'Dark teal', value: colors.T100 },
  { label: 'Dark green', value: colors.G200 },
  { label: 'Dark yellow', value: colors.Y200 },
  { label: 'Dark red', value: colors.R100 },
  { label: 'Dark purple', value: colors.P100 },
].map((color) => ({
  ...color,
  border: DEFAULT_BORDER_COLOR,
}));
/* eslint-enable @atlaskit/design-system/ensure-design-token-usage */

export const panelDarkModeBackgroundPalette: PaletteColor[] = [
  { label: 'Dark gray', value: darkPanelColors.DarkGray },
  { label: 'Dark blue', value: darkPanelColors.B1200S },
  { label: 'Dark teal', value: darkPanelColors.T1200S },
  { label: 'Dark green', value: darkPanelColors.G1200S },
  { label: 'Dark yellow', value: darkPanelColors.Y1200S },
  { label: 'Dark red', value: darkPanelColors.R1200S },
  { label: 'Dark purple', value: darkPanelColors.P1200S },

  { label: 'Gray', value: darkPanelColors.Gray },
  { label: 'blue', value: darkPanelColors.B900 },
  { label: 'teal', value: darkPanelColors.T900 },
  { label: 'green', value: darkPanelColors.G900 },
  { label: 'yellow', value: darkPanelColors.Y900 },
  { label: 'red', value: darkPanelColors.R900 },
  { label: 'purple', value: darkPanelColors.P900 },

  { label: 'Light gray', value: darkPanelColors.LightGray },
  { label: 'Light blue', value: darkPanelColors.B800S },
  { label: 'Light teal', value: darkPanelColors.T900S },
  { label: 'Light green', value: darkPanelColors.G900S },
  { label: 'Light yellow', value: darkPanelColors.Y800S },
  { label: 'Light red', value: darkPanelColors.R800S },
  { label: 'Light purple', value: darkPanelColors.P800S },
].map((color) => ({
  ...color,
  border: DEFAULT_BORDER_COLOR,
}));
