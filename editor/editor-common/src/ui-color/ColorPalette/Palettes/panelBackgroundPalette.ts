/* eslint-disable @atlassian/i18n/no-literal-string-in-object */
import { token } from '@atlaskit/tokens';

import { darkPanelColors } from '../../../panel';

import { DEFAULT_BORDER_COLOR } from './common';
import { type PaletteColor } from './type';

/** this is not new usage - old code extracted from editor-core */
/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
export const panelBackgroundPalette: PaletteColor[] = [
	// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-object
	{ label: 'White', value: '#FFFFFF' },
	// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-object
	{ label: 'Light blue', value: '#DEEBFF' },
	// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-object
	{ label: 'Light teal', value: '#E6FCFF' },
	// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-object
	{ label: 'Light green', value: '#E3FCEF' },
	// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-object
	{ label: 'Light yellow', value: '#FFFAE6' },
	// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-object
	{ label: 'Light red', value: '#FFEBE6' },
	// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-object
	{ label: 'Light purple', value: '#EAE6FF' },

	// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-object
	{ label: 'Light gray', value: '#F4F5F7' },
	// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-object
	{ label: 'Blue', value: '#B3D4FF' },
	// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-object
	{ label: 'Teal', value: '#B3F5FF' },
	// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-object
	{ label: 'Green', value: '#ABF5D1' },
	// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-object
	{ label: 'Yellow', value: '#FFF0B3' },
	// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-object
	{ label: 'Red', value: '#FFBDAD' },
	// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-object
	{ label: 'Purple', value: '#C0B6F2' },

	// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-object
	{ label: 'Gray', value: '#B3BAC5' },
	// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-object
	{ label: 'Dark blue', value: '#4C9AFF' },
	// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-object
	{ label: 'Dark teal', value: '#79E2F2' },
	// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-object
	{ label: 'Dark green', value: '#57D9A3' },
	// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-object
	{ label: 'Dark yellow', value: '#FFC400' },
	// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-object
	{ label: 'Dark red', value: '#FF8F73' },
	// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-object
	{ label: 'Dark purple', value: '#998DD9' },
].map((color) => ({
	...color,
	border: token('color.border', DEFAULT_BORDER_COLOR),
}));
/* eslint-enable @atlaskit/design-system/ensure-design-token-usage */

export const panelDarkModeBackgroundPalette: PaletteColor[] = [
	// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-object
	{ label: 'Dark gray', value: darkPanelColors.DarkGray },
	// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-object
	{ label: 'Dark blue', value: darkPanelColors.B1200S },
	// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-object
	{ label: 'Dark teal', value: darkPanelColors.T1200S },
	// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-object
	{ label: 'Dark green', value: darkPanelColors.G1200S },
	// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-object
	{ label: 'Dark yellow', value: darkPanelColors.Y1200S },
	// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-object
	{ label: 'Dark red', value: darkPanelColors.R1200S },
	// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-object
	{ label: 'Dark purple', value: darkPanelColors.P1200S },

	// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-object
	{ label: 'Gray', value: darkPanelColors.Gray },
	{ label: 'blue', value: darkPanelColors.B900 },
	{ label: 'teal', value: darkPanelColors.T900 },
	{ label: 'green', value: darkPanelColors.G900 },
	{ label: 'yellow', value: darkPanelColors.Y900 },
	{ label: 'red', value: darkPanelColors.R900 },
	{ label: 'purple', value: darkPanelColors.P900 },

	// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-object
	{ label: 'Light gray', value: darkPanelColors.LightGray },
	// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-object
	{ label: 'Light blue', value: darkPanelColors.B800S },
	// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-object
	{ label: 'Light teal', value: darkPanelColors.T900S },
	// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-object
	{ label: 'Light green', value: darkPanelColors.G900S },
	// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-object
	{ label: 'Light yellow', value: darkPanelColors.Y800S },
	// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-object
	{ label: 'Light red', value: darkPanelColors.R800S },
	// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-object
	{ label: 'Light purple', value: darkPanelColors.P800S },
].map((color) => ({
	...color,
	border: DEFAULT_BORDER_COLOR,
}));
