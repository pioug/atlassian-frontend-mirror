import { snapshot } from '@af/visual-regression';

import Example from '../../../../../examples/vr/vr-icon-circle-replacement-component';

snapshot(Example, {
	variants: [
		{
			name: 'Light',
			environment: {
				colorScheme: 'light',
			},
		},
	],
	featureFlags: {
		platform_dst_icon_tile_circle_replacement: [true, false],
	},
});
