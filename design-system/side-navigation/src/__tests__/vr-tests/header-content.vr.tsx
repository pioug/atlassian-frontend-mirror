import { snapshot } from '@af/visual-regression';

import Example from '../../../examples/13-content';

snapshot(Example, {
	variants: [
		{
			name: 'header-content',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});
