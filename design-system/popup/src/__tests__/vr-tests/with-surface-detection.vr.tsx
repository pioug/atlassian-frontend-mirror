import { snapshot } from '@af/visual-regression';

import WithSurfaceDetection from '../../../examples/surface-detection.vr.ap';

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
