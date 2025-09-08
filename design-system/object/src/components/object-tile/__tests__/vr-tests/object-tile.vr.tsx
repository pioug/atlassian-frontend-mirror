import { snapshot } from '@af/visual-regression';

import ObjectTile from '../../../../../examples/object-tile';

snapshot(ObjectTile, {
	variants: [
		{
			name: 'light mode',
			environment: {
				colorScheme: 'light',
			},
		},
	],
	featureFlags: {
		'platform-component-visual-refresh': [true, false],
	},
});
