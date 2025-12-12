import { snapshot } from '@af/visual-regression';

import Basic from '../../examples/basic';

snapshot(Basic, {
	drawsOutsideBounds: true,
	variants: [
		{
			name: 'default',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});
