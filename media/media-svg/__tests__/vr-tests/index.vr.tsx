import { snapshot } from '@af/visual-regression';

import Basic from '../../examples/test-vr-basic.vr.ap';

snapshot(Basic, {
	variants: [
		{
			name: 'Default',
			environment: {},
		},
		{
			name: 'Light',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});
