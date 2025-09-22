import { snapshot } from '@af/visual-regression';

import Example from '../../../../../examples/110-icon-tile';

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
		platform_dst_new_icon_tile: [true, false],
	},
});
