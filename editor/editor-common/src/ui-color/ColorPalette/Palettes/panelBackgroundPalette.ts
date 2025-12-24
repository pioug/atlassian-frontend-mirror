import { token } from '@atlaskit/tokens';

import { DEFAULT_BORDER_COLOR } from './common';
import type { PaletteColor } from './type';

export const panelBackgroundPalette: PaletteColor[] = [
	{ label: 'White' as const, value: '#FFFFFF' },
	{ label: 'Light blue' as const, value: '#DEEBFF' },
	{ label: 'Light teal' as const, value: '#E6FCFF' },
	{ label: 'Light green' as const, value: '#E3FCEF' },
	{ label: 'Light yellow' as const, value: '#FFFAE6' },
	{ label: 'Light red' as const, value: '#FFEBE6' },
	{ label: 'Light purple' as const, value: '#EAE6FF' },

	{ label: 'Light gray' as const, value: '#F4F5F7' },
	{ label: 'Blue' as const, value: '#B3D4FF' },
	{ label: 'Teal' as const, value: '#B3F5FF' },
	{ label: 'Green' as const, value: '#ABF5D1' },
	{ label: 'Yellow' as const, value: '#FFF0B3' },
	{ label: 'Red' as const, value: '#FFBDAD' },
	{ label: 'Purple' as const, value: '#C0B6F2' },

	{ label: 'Gray' as const, value: '#B3BAC5' },
	{ label: 'Dark blue' as const, value: '#4C9AFF' },
	{ label: 'Dark teal' as const, value: '#79E2F2' },
	{ label: 'Dark green' as const, value: '#57D9A3' },
	{ label: 'Dark yellow' as const, value: '#FFC400' },
	{ label: 'Dark red' as const, value: '#FF8F73' },
	{ label: 'Dark purple' as const, value: '#998DD9' },
].map((color) => ({
	...color,
	border: token('color.border', DEFAULT_BORDER_COLOR),
}));
