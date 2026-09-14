import { snapshot } from '@af/visual-regression';

import Basic from '../../examples/basic.vr.ap';

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
