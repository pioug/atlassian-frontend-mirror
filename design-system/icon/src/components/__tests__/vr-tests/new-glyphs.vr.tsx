import { snapshot } from '@af/visual-regression';

import Example from '../../../../examples/vr/vr-new-icon-button';

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
