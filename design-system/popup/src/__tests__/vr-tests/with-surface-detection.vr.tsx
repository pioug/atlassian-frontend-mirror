import { snapshot } from '@af/visual-regression';

import WithSurfaceDetection from '../../../examples/surface-detection';

snapshot(WithSurfaceDetection, {
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
