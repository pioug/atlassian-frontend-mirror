import { snapshot } from '@af/visual-regression';

import Example from '../../../../../examples/vr/vr-icon-tile-legacy-fallback';

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
		'platform-visual-refresh-icons': [true, false],
		platform_dst_new_icon_tile: [true, false],
	},
});
