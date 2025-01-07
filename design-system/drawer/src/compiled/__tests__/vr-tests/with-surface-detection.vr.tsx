// eslint-disable-next-line @repo/internal/fs/filename-pattern-match
import { snapshot } from '@af/visual-regression';

import WithSurfaceDetection from '../../../../examples/100-composition-surface-detection';

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
