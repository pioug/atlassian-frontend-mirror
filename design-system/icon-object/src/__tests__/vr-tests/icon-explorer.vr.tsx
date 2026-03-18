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
	waitForNetworkIdle: true,
});
