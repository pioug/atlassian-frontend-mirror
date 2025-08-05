import { snapshot } from '@af/visual-regression';

import Basic from '../../examples/basic';

snapshot(Basic, {
	featureFlags: {
		'platform-component-visual-refresh': true,
	},
	variants: [
		{
			name: 'Light',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});
