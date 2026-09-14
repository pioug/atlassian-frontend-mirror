import { snapshot } from '@af/visual-regression';

import Example from '../../../examples/color-inheritance.vr.ap';

snapshot(Example, {
	drawsOutsideBounds: true,
	variants: [
		{
			name: 'Light',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});
