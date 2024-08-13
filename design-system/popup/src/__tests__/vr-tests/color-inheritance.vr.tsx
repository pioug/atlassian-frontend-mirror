import { snapshot } from '@af/visual-regression';

import Example from '../../../examples/color-inheritance';

snapshot(Example, {
	drawsOutsideBounds: true,
	variants: [
		{
			name: 'Light',
			environment: {
				colorScheme: 'light',
			},
		},
		{
			name: 'Dark',
			environment: {
				colorScheme: 'dark',
			},
		},
	],
});
