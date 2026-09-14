import { snapshot } from '@af/visual-regression';

import Example from '../../../../examples/vr/vr-new-icon-button.vr.ap';

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
