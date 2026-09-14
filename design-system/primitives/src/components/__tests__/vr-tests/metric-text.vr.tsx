import { snapshot } from '@af/visual-regression';

import Basic from '../../../../examples/73-metric-text.vr.ap';

snapshot(Basic, {
	variants: [
		{
			name: 'text default',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});
