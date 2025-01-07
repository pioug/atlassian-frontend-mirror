// eslint-disable-next-line @repo/internal/fs/filename-pattern-match
import { snapshot } from '@af/visual-regression';

import WithMenu from '../../../../examples/101-composition-menu';

snapshot(WithMenu, {
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
