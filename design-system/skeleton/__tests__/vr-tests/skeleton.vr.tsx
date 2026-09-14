import { snapshot } from '@af/visual-regression';

import All from '../../examples/all.vr.ap';

snapshot(All, {
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
