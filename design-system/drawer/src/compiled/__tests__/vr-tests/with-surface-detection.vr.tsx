// eslint-disable-next-line @repo/internal/fs/filename-pattern-match
import { snapshot } from '@af/visual-regression';

import WithSurfaceDetection from '../../../../examples/100-composition-surface-detection';

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
