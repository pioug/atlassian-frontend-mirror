import { snapshot } from '@af/visual-regression';

import Basic from '../../examples/basic';

snapshot(Basic, {
	variants: [
		{
			name: 'Light',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});
