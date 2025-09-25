import { snapshot } from '@af/visual-regression';

import IconExplorer from '../../../examples/icon-explorer';

snapshot(IconExplorer, {
	description: 'Icon explorer',
	variants: [
		{
			name: 'Light',
			environment: {
				colorScheme: 'light',
			},
		},
	],
	featureFlags: {
		platform_dst_icon_object_to_object: [true, false],
	},
	waitForNetworkIdle: true,
});
