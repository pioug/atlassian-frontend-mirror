import { snapshot } from '@af/visual-regression';

import Example from '../../../examples/go-back-item.vr.ap';

snapshot(Example, {
	variants: [
		{
			name: 'go-back-item',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});
