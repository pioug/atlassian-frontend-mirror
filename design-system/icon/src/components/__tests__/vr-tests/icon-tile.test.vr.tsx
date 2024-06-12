import { snapshot } from '@af/visual-regression';

import Example from '../../../../examples/vr/vr-icon-tile';

snapshot(Example, {
	variants: [
		{
			name: 'Light',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});
