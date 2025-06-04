import { snapshot } from '@af/visual-regression';

import WithSurfaceDetection from '../../../examples/94-surface-detection';

snapshot(WithSurfaceDetection, {
	drawsOutsideBounds: true,
	variants: [
		// eslint-disable-next-line @atlaskit/design-system/no-dark-theme-vr-tests -- test is only relevant for dark theme
		{
			name: 'Dark',
			environment: {
				colorScheme: 'dark',
			},
		},
	],
});
