import { token } from '@atlaskit/tokens';

import { darkPanelColors } from '../../../panel';

import { DEFAULT_BORDER_COLOR } from './common';
import { type PaletteColor } from './type';

/** this is not new usage - old code extracted from editor-core */
/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
export const panelBackgroundPalette: PaletteColor[] = [
	{ label: 'White', value: '#FFFFFF' },
	{ label: 'Light blue', value: '#DEEBFF' },
	{ label: 'Light teal', value: '#E6FCFF' },
	{ label: 'Light green', value: '#E3FCEF' },
	{ label: 'Light yellow', value: '#FFFAE6' },
	{ label: 'Light red', value: '#FFEBE6' },
	{ label: 'Light purple', value: '#EAE6FF' },

	{ label: 'Light gray', value: '#F4F5F7' },
	{ label: 'Blue', value: '#B3D4FF' },
	{ label: 'Teal', value: '#B3F5FF' },
	{ label: 'Green', value: '#ABF5D1' },
	{ label: 'Yellow', value: '#FFF0B3' },
	{ label: 'Red', value: '#FFBDAD' },
	{ label: 'Purple', value: '#C0B6F2' },

	{ label: 'Gray', value: '#B3BAC5' },
	{ label: 'Dark blue', value: '#4C9AFF' },
	{ label: 'Dark teal', value: '#79E2F2' },
	{ label: 'Dark green', value: '#57D9A3' },
	{ label: 'Dark yellow', value: '#FFC400' },
	{ label: 'Dark red', value: '#FF8F73' },
	{ label: 'Dark purple', value: '#998DD9' },
].map((color) => ({
	...color,
	border: token('color.border', DEFAULT_BORDER_COLOR),
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
